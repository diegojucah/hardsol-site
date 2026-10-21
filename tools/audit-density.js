#!/usr/bin/env node
/**
 * Auditoria de densidade de conteúdo por página: mede relação imagem/texto
 * e contagem de headings. Vazado como tabela para conferência manual.
 * Uso: node tools/audit-density.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".preview", "frames", "tools"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const rows = [];
for (const f of walk(ROOT, [])) {
  const html = fs.readFileSync(f, "utf8");
  const inBody = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  const imgs = (inBody.match(/<img/g) || []).length;
  const words = (inBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean)).length;
  const h2 = (inBody.match(/<h2/g) || []).length;
  const h3 = (inBody.match(/<h3/g) || []).length;
  const rel = path.relative(ROOT, f);
  const ratio = imgs ? Math.round(words / imgs) : words;
  rows.push({ rel, imgs, words, h2, h3, ratio, len: words });
}

rows.sort((a, b) => a.ratio - b.ratio);
const pad = (s, n) => (String(s).padEnd(n).slice(0, n));
console.log(pad("PÁGINA", 42) + pad("img", 6) + pad("palavras", 10) + pad("h2", 5) + pad("h3", 5) + "palavras/img");
rows.forEach((r) => {
  const flag = r.ratio < 60 ? " ⚠ imagem-dominante" : r.ratio > 400 ? " ⚠ texto-dominante" : "";
  console.log(pad(r.rel, 42) + pad(r.imgs, 6) + pad(r.words, 10) + pad(r.h2, 5) + pad(r.h3, 5) + r.ratio + flag);
});
const flagged = rows.filter((r) => r.ratio < 60 || r.ratio > 400).length;
console.log(`\nCritérios: img>0 e palavras/img 60..400. Páginas sinalizadas: ${flagged}`);
