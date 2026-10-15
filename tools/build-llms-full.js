#!/usr/bin/env node
/**
 * Gera llms-full.txt — o conteúdo textual completo do site em Markdown,
 * para agentes de IA que querem ler tudo em uma única requisição.
 *
 * Uso: node tools/build-llms-full.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BASE = String(JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8")).baseUrl).replace(/\/+$/, "");

const ORDER = [
  "index.html",
  "quem-somos.html",
  "servicos.html",
  "servicos/solar-fotovoltaico.html",
  "servicos/carregamento-ev.html",
  "servicos/aquecimento-solar.html",
  "servicos/bombeamento-solar.html",
  "servicos/eletrica.html",
  "servicos/pos-venda.html",
  "trabalhos.html",
  "sustentabilidade.html",
  "contato.html",
];

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function htmlToText(html) {
  return decode(
    html
      .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, "")
      .replace(/<h1[^>]*>/gi, "\n\n# ")
      .replace(/<h2[^>]*>/gi, "\n\n## ")
      .replace(/<h3[^>]*>/gi, "\n\n### ")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/(p|div|li|ul|ol|section|article|h1|h2|h3|tr)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const out = [
  "# HardSol Energia Solar — conteúdo completo",
  "",
  "> Documento único com o texto de todas as páginas do site. Versão resumida em /llms.txt.",
  "> Fonte: " + BASE + "/",
  "",
];

let pages = 0;
for (const file of ORDER) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) continue;
  const html = fs.readFileSync(abs, "utf8");
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [, file])[1].trim();
  const main = (html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i) || [, html])[1];
  const url = BASE + "/" + (file === "index.html" ? "" : file);
  out.push("---", "", "## " + title, "", "URL: " + url, "", htmlToText(main), "");
  pages++;
}

fs.writeFileSync(path.join(ROOT, "llms-full.txt"), out.join("\n").replace(/\n{3,}/g, "\n\n"));
console.log("llms-full.txt gerado: " + pages + " páginas");
