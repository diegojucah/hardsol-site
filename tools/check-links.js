#!/usr/bin/env node
/* Verificador de links/ativos locais: varre os HTML e confere se cada href/src
   local aponta para um arquivo existente. Ignora http(s), mailto, tel e âncoras.
   Uso: node tools/check-links.js */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const files = walk(ROOT, []);
let missing = 0;
let checked = 0;
const re = /(?:href|src)\s*=\s*"([^"]+)"/g;

for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|#|data:|\/\/)/.test(url)) continue;
    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(f), clean);
    checked++;
    if (!fs.existsSync(target)) {
      missing++;
      console.log("MISSING  " + path.relative(ROOT, f) + "  ->  " + url);
    }
  }
}
console.log(`checked=${checked} files=${files.length} missing=${missing}`);
process.exit(missing ? 1 : 0);
