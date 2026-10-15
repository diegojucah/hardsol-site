#!/usr/bin/env node
/**
 * Define a URL pública do site (canonical, og:url, og:image, sitemap e robots).
 * É idempotente: rodar várias vezes com a mesma URL não altera o resultado.
 *
 * Uso:
 *   node tools/set-site-url.js https://diegojucah.github.io/hardsol-site
 *   node tools/set-site-url.js https://www.hardsol.com.br        # quando o domínio chegar
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const raw = process.argv[2];
if (!raw || !/^https?:\/\//.test(raw)) {
  console.error("Uso: node tools/set-site-url.js https://exemplo.com[/subpasta]");
  process.exit(1);
}
const BASE = raw.replace(/\/+$/, "");
const BASE_PATH = new URL(BASE).pathname.replace(/^\/+|\/+$/g, ""); // "" ou "hardsol-site"

// Base anterior (para reescrever arquivos que não são HTML, ex.: llms.txt).
let PREV_BASE = "";
try {
  PREV_BASE = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8")).baseUrl || "";
} catch (e) {
  /* sem config anterior */
}
PREV_BASE = String(PREV_BASE).replace(/\/+$/, "");

// Mantém a configuração usada pelo gerador de páginas em sincronia.
fs.writeFileSync(
  path.join(ROOT, "site.config.json"),
  JSON.stringify({ baseUrl: BASE }, null, 2) + "\n"
);

/** Reduz qualquer forma de caminho à forma relativa à raiz do site. */
function siteRelative(value) {
  let s = String(value).trim();
  s = s.replace(/^https?:\/\/[^/]+/, ""); // remove esquema + host
  let before;
  do {
    before = s;
    s = s.replace(/^(\.\.\/)+/, "").replace(/^\.\//, "").replace(/^\/+/, "");
    if (BASE_PATH && (s === BASE_PATH || s.startsWith(BASE_PATH + "/"))) {
      s = s.slice(BASE_PATH.length);
    }
  } while (s !== before);
  return s;
}

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".preview", "frames"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

let pages = 0;
for (const file of walk(ROOT, [])) {
  let html = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const pageUrl = BASE + "/" + (rel === "index.html" ? "" : rel);

  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${pageUrl}$2`);

  html = html.replace(/(<meta property="og:image" content=")([^"]*)(")/, (m, a, val, c) => {
    return a + BASE + "/" + siteRelative(val) + c;
  });

  if (/<meta property="og:url"/.test(html)) {
    html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl}$2`);
  } else {
    html = html.replace(
      /(<meta property="og:type" content="website" \/>)/,
      `$1\n<meta property="og:url" content="${pageUrl}" />`
    );
  }

  fs.writeFileSync(file, html);
  pages++;
}

// sitemap.xml
const sitemap = path.join(ROOT, "sitemap.xml");
if (fs.existsSync(sitemap)) {
  let xml = fs.readFileSync(sitemap, "utf8");
  xml = xml.replace(/<loc>([^<]+)<\/loc>/g, (m, url) => {
    let p = url.replace(/^https?:\/\/[^/]+/, "");
    try {
      p = new URL(url.trim()).pathname;
    } catch (e) {
      /* mantém o que veio */
    }
    p = siteRelative(p);
    return "<loc>" + BASE + "/" + p + "</loc>";
  });
  fs.writeFileSync(sitemap, xml);
}

// robots.txt
const robots = path.join(ROOT, "robots.txt");
if (fs.existsSync(robots)) {
  let txt = fs.readFileSync(robots, "utf8");
  txt = txt.replace(/^Sitemap:.*$/m, "Sitemap: " + BASE + "/sitemap.xml");
  fs.writeFileSync(robots, txt);
}

// llms.txt (URLs absolutas) — troca a base anterior pela nova.
const llms = path.join(ROOT, "llms.txt");
if (fs.existsSync(llms) && PREV_BASE && PREV_BASE !== BASE) {
  let txt = fs.readFileSync(llms, "utf8");
  txt = txt.split(PREV_BASE).join(BASE);
  fs.writeFileSync(llms, txt);
}

console.log("URL do site: " + BASE + "  (" + pages + " páginas + sitemap + robots)");
