#!/usr/bin/env node
/**
 * Gerador das páginas internas (HTML estático) do site HardSol.
 * Emite SEO completo (robots, canonical, OG, Twitter) e dados estruturados
 * JSON-LD por tipo de página. Usa a URL base de site.config.json.
 *
 * Uso:  node tools/build-pages.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const BASE = String(CONFIG.baseUrl || "https://www.hardsol.com.br").replace(/\/+$/, "");
const WHATS =
  "https://api.whatsapp.com/send?phone=5592993483553&text=Estou interessado nos serviços da HardSol";

const abs = (p) => BASE + "/" + String(p).replace(/^\/+/, "");

/* --------------------------------- dados --------------------------------- */

const NAV = [
  ["index.html", "Início"],
  ["quem-somos.html", "Quem somos"],
  ["servicos.html", "Serviços"],
  ["trabalhos.html", "Trabalhos"],
  ["sustentabilidade.html", "Sustentabilidade"],
  ["contato.html", "Contato"],
];

const SERVICES = [
  {
    slug: "servicos/solar-fotovoltaico.html",
    img: "flow/cena-2-paineis-card.webp",
    hero: "flow/cena-2-paineis.webp",
    meta: "Fotovoltaico",
    title: "Projetos e instalações fotovoltaicas",
    blurb:
      "Sistemas OnGrid (conectados à rede) e OffGrid (isolados), com projeto, homologação e instalação.",
    body: `
      <p>Gerar a própria energia é, hoje, a forma mais simples e rápida de cortar despesas: é barato, autofinanciável, tem baixa manutenção e a instalação é direta.</p>
      <p>A ideia de que a energia fotovoltaica é cara demais ficou no passado. Com a popularização da tecnologia, ela virou uma solução viável para residências, comércios e indústrias — cada um com a potência adequada ao seu consumo.</p>
      <p>Um sistema é formado por painéis solares, inversores, estrutura de fixação, cabos e conectores. Nos sistemas off-grid entram também as baterias, que armazenam a energia. A estrutura tem longa duração, com garantia de até 25 anos conforme o fabricante.</p>
      <h2>O que entregamos</h2>
      <ul>
        <li>Sistemas On Grid (conectados à rede da concessionária)</li>
        <li>Sistemas Off Grid (sistemas isolados, com baterias)</li>
        <li>Projeto, dimensionamento, homologação e instalação</li>
        <li>Monitoramento de geração e pós-venda</li>
      </ul>`,
  },
  {
    slug: "servicos/carregamento-ev.html",
    img: "flow/cena-4-carro-card.webp",
    hero: "flow/cena-4-carro.webp",
    meta: "Mobilidade",
    title: "Carregamento de carros elétricos",
    blurb:
      "Eletro posto solar e garagem solar para residências, prédios, comércios e indústrias.",
    body: `
      <p>Em dez anos, 5% dos veículos leves no Brasil serão movidos a eletricidade. Ao fim de cada dia, esses carros vão recarregar as baterias — e o lugar mais natural para isso é a garagem de casa ou do prédio.</p>
      <p>A HardSol projeta e instala estações de carregamento integradas à geração fotovoltaica, para que o carro seja abastecido pela luz do sol.</p>
      <h2>Aplicações</h2>
      <ul>
        <li>Eletro posto solar</li>
        <li>Garagem solar residencial</li>
        <li>Garagem solar comercial, predial e industrial</li>
      </ul>`,
  },
  {
    slug: "servicos/aquecimento-solar.html",
    img: "flow/cena-5-agua-card.webp",
    hero: "flow/cena-5-agua.webp",
    meta: "Térmica",
    title: "Aquecimento de água solar",
    blurb:
      "Energia solar térmica convencional e a vácuo para condomínios, hotéis, restaurantes e indústrias.",
    body: `
      <p>Projeto e instalação de energia solar térmica nas modalidades convencional e a vácuo, reduzindo o consumo elétrico no aquecimento de água.</p>
      <p>Atendemos condomínios, hotéis, motéis, restaurantes, indústrias e comércios, com dimensionamento adequado a cada perfil de consumo.</p>`,
  },
  {
    slug: "servicos/bombeamento-solar.html",
    img: "flow/cena-1-amanhecer-card.webp",
    hero: "flow/cena-1-amanhecer.webp",
    meta: "Bombeamento",
    title: "Bombeamento de água solar",
    blurb: "Sistemas completos de bombas submersas e vibratórias das principais marcas do mercado.",
    body: `
      <p>Instalação e projeto de sistemas completos de bombeamento de água solar, com bombas submersas e vibratórias das principais marcas do mercado.</p>
      <p>Ideal para irrigação e abastecimento de condomínios e residências: opera durante o dia, sem consumo de energia da rede e com baixa manutenção.</p>`,
  },
  {
    slug: "servicos/eletrica.html",
    img: "flow/cena-6-cidade-card.webp",
    hero: "flow/cena-6-cidade.webp",
    meta: "Elétrica",
    title: "Elétrica residencial e predial",
    blurb: "Projeto e instalação de redes elétricas estabilizadas de baixa e alta tensão.",
    body: `
      <p>Projeto e instalação de redes elétricas estabilizadas de baixa e alta tensão para residências, comércios e indústrias.</p>
      <p>Infraestrutura segura e adequada, integrada ou não a sistemas de geração solar.</p>`,
  },
  {
    slug: "servicos/pos-venda.html",
    img: "flow/cena-3-casa-card.webp",
    hero: "flow/cena-3-casa.webp",
    meta: "Pós-venda",
    title: "Pós-Venda Expresso Solar",
    blurb:
      "Manutenção preventiva e corretiva: monitoramento, limpeza de painéis, correção de faturamento e backup.",
    body: `
      <p>Acompanhamos o cliente depois da instalação. Sujeira acumulada, desgaste, falha de componentes ou troca de equipamentos afetam a geração — e a gente resolve antes de virar prejuízo.</p>
      <p>Nossa equipe monitora sistematicamente os sistemas que instalamos e mantém um canal direto para dúvidas sobre o projeto.</p>
      <h2>O que está incluído</h2>
      <ul>
        <li>Limpeza de painéis</li>
        <li>Monitoramento de geração</li>
        <li>Correção de faturamento junto à concessionária</li>
        <li>Correção de sistemas solares</li>
        <li>Configuração de monitoramento</li>
        <li>Backup de inversores, microinversores e painéis</li>
        <li>Esclarecimentos técnicos e consultoria</li>
      </ul>
      <p><strong>Contato pós-venda:</strong> <a href="tel:+5592992672491">(92) 99267-2491</a></p>`,
    gallery: Array.from({ length: 9 }, (_, i) => "posvenda/" + String(i + 1).padStart(3, "0") + ".jpg"),
  },
];

const WORKS = [
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-01.jpg", tags: ["residencial"], kwp: 4.4, specs: [["Potência", "4,40 kWp"], ["Módulos", "8 × 550 W"], ["Inversor", "4 kW"], ["Economia", "R$ 680,40/mês"]] },
  { loc: "Manaus – AM", title: "OnGrid Comercial", img: "trabalho-02.jpg", tags: ["comercial"], kwp: 60.48, specs: [["Potência", "60,48 kWp"], ["Módulos", "112 × 540 W"], ["Inversor", "20 kW"], ["Economia", "R$ 9.324,00/mês"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-03.jpg", tags: ["residencial"], kwp: 5.4, specs: [["Potência", "5,40 kWp"], ["Módulos", "12 × 450 W"], ["Microinversor", "1.500 W"], ["Economia", "R$ 831,60/mês"]] },
  { loc: "Alto Paraíso – RO", title: "OnGrid Residencial", img: "trabalho-04.jpg", tags: ["residencial"], kwp: 11.39, specs: [["Potência", "11,39 kWp"], ["Módulos", "34 × BYD 335 W"], ["Inversor", "REFUsol 20.000 W"]] },
  { loc: "São Sebastião da Boa Vista – PA", title: "OnGrid Residencial", img: "trabalho-05.jpg", tags: ["residencial"], kwp: 5.39, specs: [["Potência", "5,39 kWp"], ["Módulos", "18 × Intelbras 330 W"], ["Inversor", "Intelbras 4.600 W"]] },
  { loc: "Cabo Frio – RJ", title: "OnGrid Residencial", img: "trabalho-06.jpg", tags: ["residencial"], kwp: 6.03, specs: [["Potência", "6,03 kWp"], ["Módulos", "18 × BYD 335 W"], ["Inversor", "REFUsol 5.000 W"]] },
  { loc: "Maceió – AL", title: "OnGrid Predial", img: "trabalho-07.jpg", tags: ["predial"], kwp: 3.3, specs: [["Potência", "3,3 kWp"], ["Módulos", "10 × Canadian 330 W"], ["Inversor", "Canadian Solar 5.000 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-08.jpg", tags: ["residencial"], kwp: 3.25, specs: [["Potência", "3,25 kWp"], ["Módulos", "10 × Canadian 325 W"], ["Inversor", "Fronius Primo 3.000 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-09.jpg", tags: ["residencial"], kwp: 5.67, specs: [["Potência", "5,67 kWp"], ["Módulos", "21 × Jinko 270 W"], ["Inversor", "Growatt 5.500 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-10.jpg", tags: ["residencial"], kwp: 5.5, specs: [["Potência", "5,5 kWp"], ["Módulos", "17 × Jinko 340 W"], ["Inversor", "Growatt"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-11.jpg", tags: ["residencial"], kwp: 12.42, specs: [["Potência", "12,42 kWp"], ["Módulos", "36 × Canadian 345 W"], ["Inversor", "Fronius 12.000 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-12.jpg", tags: ["residencial"], kwp: 25, specs: [["Potência", "25 kWp"], ["Módulos", "80 × Canadian 320 W"], ["Inversor", "Fronius 25.000 W"]] },
];

const TOTAL_KWP = Math.round(WORKS.reduce((s, w) => s + w.kwp, 0));
const STATES = new Set(WORKS.map((w) => (w.loc.split("–")[1] || "").trim())).size;

/* ------------------------------ schema.org ------------------------------- */

const ORG_ID = BASE + "/#organization";
const ORG = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "HardSol Energia Solar",
  legalName: "HardSol Energia Solar",
  url: BASE + "/",
  logo: abs("assets/img/favicon.svg"),
  image: abs("assets/img/flow/cena-2-paineis.webp"),
  description:
    "Empresa de microgeração de energia solar fotovoltaica: projetos, instalação e pós-venda de sistemas OnGrid e OffGrid, aquecimento e bombeamento de água solar e carregamento de veículos elétricos.",
  foundingDate: "2014",
  areaServed: ["Amazonas", "Região Norte", "Brasil"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manaus",
    addressRegion: "AM",
    addressCountry: "BR",
  },
  contactPoint: [
    { "@type": "ContactPoint", telephone: "+55-92-99348-3553", contactType: "sales", areaServed: "BR", availableLanguage: "pt-BR" },
    { "@type": "ContactPoint", telephone: "+55-92-99267-2491", contactType: "customer support", areaServed: "BR", availableLanguage: "pt-BR" },
  ],
  sameAs: ["https://www.youtube.com/watch?v=Xu_NYPAjhHU"],
  knowsAbout: [
    "energia solar fotovoltaica",
    "sistemas OnGrid",
    "sistemas OffGrid",
    "aquecimento de água solar",
    "bombeamento de água solar",
    "carregamento de veículos elétricos",
  ],
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": BASE + "/#website",
  url: BASE + "/",
  name: "HardSol Energia Solar",
  inLanguage: "pt-BR",
  publisher: { "@id": ORG_ID },
};

const LOCALBIZ = {
  "@type": "LocalBusiness",
  "@id": BASE + "/#localbusiness",
  name: "HardSol Energia Solar",
  image: abs("assets/img/flow/cena-2-paineis.webp"),
  url: BASE + "/",
  telephone: "+55-92-99348-3553",
  foundingDate: "2014",
  priceRange: "$$",
  address: { "@type": "PostalAddress", addressLocality: "Manaus", addressRegion: "AM", addressCountry: "BR" },
  areaServed: ["Amazonas", "Região Norte", "Brasil"],
  parentOrganization: { "@id": ORG_ID },
};

const breadcrumb = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

const itemList = (name, items) => ({
  "@type": "ItemList",
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    url: it.url,
  })),
});

function jsonld(graph) {
  const clean = graph.filter(Boolean).map((o) => {
    const copy = Object.assign({}, o);
    delete copy["@context"];
    return copy;
  });
  if (!clean.length) return "";
  const payload = { "@context": "https://schema.org", "@graph": clean };
  return `<script type="application/ld+json">\n${JSON.stringify(payload, null, 2)}\n</script>`;
}

/* -------------------------------- helpers -------------------------------- */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function head({ title, desc, canonical, base, ogImage, ogAlt }) {
  const img = abs("assets/img/" + (ogImage || "flow/cena-2-paineis.webp"));
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script>document.documentElement.classList.add("js");</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(plain(desc))}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<meta name="googlebot" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${canonical}" />
<meta name="theme-color" content="#f9f7f7" />
<meta name="author" content="HardSol Energia Solar" />
<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml" />
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="HardSol Energia Solar" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(plain(desc))}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:alt" content="${esc(ogAlt || title)}" />
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(plain(desc))}" />
<meta name="twitter:image" content="${img}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${base}assets/css/style.css" />
</head>`;
}

const LOGO_SVG = `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6.5" fill="#ffbc3b"/><g stroke="#ffbc3b" stroke-width="1.8" stroke-linecap="round"><path d="M16 2.5v4M16 25.5v4M2.5 16h4M25.5 16h4M6.4 6.4l2.9 2.9M22.7 22.7l2.9 2.9M25.6 6.4l-2.9 2.9M9.3 22.7l-2.9 2.9"/></g></svg>`;

function header(base, current) {
  const links = NAV.map(
    ([href, label]) => `<a href="${base}${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("\n    ");
  return `<header class="site-header">
  <a class="brand" href="${base}index.html" aria-label="HardSol Energia Solar — início">
    ${LOGO_SVG}
    <span>Hard<b>Sol</b></span>
  </a>
  <nav class="nav" aria-label="Principal">
    ${links}
  </nav>
  <div class="header-cta">
    <a class="btn btn--solar" href="${WHATS}" target="_blank" rel="noopener">Solicitar orçamento</a>
    <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">Menu</button>
  </div>
</header>`;
}

function footer(base) {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="${base}index.html" style="margin-bottom:1rem">
          ${LOGO_SVG}
          <span>Hard<b>Sol</b></span>
        </a>
        <p style="color:var(--muted);max-width:34ch">Microgeração de energia solar fotovoltaica. Manaus/AM, Região Norte e parceiros em todo o Brasil.</p>
      </div>
      <div>
        <h4>Serviços</h4>
        <ul>
          <li><a href="${base}servicos/solar-fotovoltaico.html">Solar fotovoltaico</a></li>
          <li><a href="${base}servicos/carregamento-ev.html">Carregamento de EV</a></li>
          <li><a href="${base}servicos/aquecimento-solar.html">Aquecimento de água</a></li>
          <li><a href="${base}servicos/bombeamento-solar.html">Bombeamento solar</a></li>
          <li><a href="${base}servicos/eletrica.html">Elétrica</a></li>
          <li><a href="${base}servicos/pos-venda.html">Pós-venda</a></li>
        </ul>
      </div>
      <div>
        <h4>Institucional</h4>
        <ul>
          <li><a href="${base}quem-somos.html">Quem somos</a></li>
          <li><a href="${base}trabalhos.html">Trabalhos</a></li>
          <li><a href="${base}sustentabilidade.html">Sustentabilidade</a></li>
          <li><a href="${base}contato.html">Contato</a></li>
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul>
          <li><a href="https://api.whatsapp.com/send?phone=5592993483553" target="_blank" rel="noopener">(92) 99348-3553</a></li>
          <li><a href="tel:+5592992672491">(92) 99267-2491 · pós-venda</a></li>
          <li><a href="https://www.youtube.com/watch?v=Xu_NYPAjhHU" target="_blank" rel="noopener">YouTube</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> HardSol Energia Solar. Todos os direitos reservados.</span>
      <span>Manaus · Amazonas · Brasil</span>
    </div>
  </div>
</footer>`;
}

const WHATS_FLOAT = `<a class="whats" href="${WHATS}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.7-1.2-4.4-4-4.5-4.2-.1-.2-1-1.4-1-2.6 0-1.3.6-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.8c.1-.2.3-.1.5-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg>
  <span>WhatsApp</span>
</a>`;

function layout({ file, base = "", current = "", title, desc, hero, body, schema = [], inlineScript = "" }) {
  const canonical = BASE + "/" + (file === "index.html" ? "" : file);
  const heroMedia = hero.image
    ? `<div class="feature feature--split">
      <div>
        ${hero.eyebrow ? `<span class="eyebrow">${esc(hero.eyebrow)}</span>` : ""}
        <h1>${hero.h1}</h1>
        <p class="lead">${hero.lead}</p>
      </div>
      <div><img src="${base}assets/img/${hero.image}" alt="${esc(hero.imageAlt || "")}" style="border-radius:16px;box-shadow:var(--shadow-md);width:100%" /></div>
    </div>`
    : `${hero.eyebrow ? `<span class="eyebrow">${esc(hero.eyebrow)}</span>` : ""}
      <h1>${hero.h1}</h1>
      <p class="lead">${hero.lead}</p>`;

  const crumbs = breadcrumb([
    { name: "Início", url: BASE + "/" },
    { name: hero.crumb, url: canonical },
  ]);

  return `${head({ title, desc, canonical, base, ogImage: hero.image, ogAlt: hero.imageAlt })}
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header(base, current)}
<main id="conteudo">
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Você está em">
        <a href="${base}index.html">Início</a>
        <span>/</span>
        <span>${esc(hero.crumb)}</span>
      </nav>
      ${heroMedia}
    </div>
  </section>
${body}
</main>
${footer(base)}
${WHATS_FLOAT}
<script src="${base}assets/js/vendor/lenis.min.js" defer></script>
<script src="${base}assets/js/vendor/gsap.min.js" defer></script>
<script src="${base}assets/js/vendor/ScrollTrigger.min.js" defer></script>
<script src="${base}assets/js/motion.js" defer></script>
<script src="${base}assets/js/nav.js" defer></script>
${jsonld([ORG, crumbs, ...schema])}${inlineScript ? "\n" + inlineScript : ""}
</body>
</html>`;
}

const section = (inner, cls = "section") => `<section class="${cls}">\n  <div class="container">\n${inner}\n  </div>\n</section>`;

const serviceCard = (s, base) => `<article class="card" data-reveal>
  <div class="card__media"><img src="${base}assets/img/${s.img}" alt="${esc(s.title)}" loading="lazy" /></div>
  <div class="card__body">
    <span class="card__meta">${esc(s.meta)}</span>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.blurb)}</p>
    <a class="card__link" href="${base}${s.slug}">Saiba mais →</a>
  </div>
</article>`;

const workCard = (w, base) => {
  const chip = w.tags[0];
  const chipCls = chip === "comercial" ? "chip chip--blue" : chip === "predial" ? "chip chip--green" : "chip";
  return `<article class="card" data-tags="${w.tags.join(" ")}" data-reveal>
  <div class="card__media"><img src="${base}assets/img/trabalhos/${w.img}" alt="${esc(w.title + " em " + w.loc)}" loading="lazy" /></div>
  <div class="card__body">
    <span class="${chipCls}">${chip.charAt(0).toUpperCase() + chip.slice(1)}</span>
    <h3>${esc(w.title)}</h3>
    <p style="margin-bottom:.2rem">${esc(w.loc)}</p>
    <ul class="card__specs">
      ${w.specs.map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("\n      ")}
    </ul>
  </div>
</article>`;
};

const relatedServices = (base, exclude) =>
  section(
    `<div class="section-head"><span class="num">Serviços relacionados</span><h2>Veja também</h2></div>
  <div class="grid grid--3">
    ${SERVICES.filter((s) => s.slug !== exclude).slice(0, 3).map((s) => serviceCard(s, base)).join("\n    ")}
  </div>`,
    "section section--soft"
  );

const ctaBand = (title = "Faça uma simulação e descubra sua economia") =>
  section(
    `<div class="cta-band" data-reveal>
    <h2>${title}</h2>
    <p>Informe o seu consumo e receba uma proposta com estimativa de geração, potência do sistema e retorno do investimento.</p>
    <a class="btn btn--solar btn--lg" href="${WHATS}" target="_blank" rel="noopener">Falar no WhatsApp</a>
  </div>`,
    "section section--soft"
  );

/* --------------------------------- páginas -------------------------------- */

const pages = {};

// ---- Quem somos
pages["quem-somos.html"] = layout({
  file: "quem-somos.html",
  current: "quem-somos.html",
  title: "Quem somos — HardSol Energia Solar",
  desc: "Criada em 2014 em Manaus/AM, a HardSol atua em microgeração de energia solar fotovoltaica: projetos, instalação e pós-venda no Amazonas e Região Norte.",
  hero: { crumb: "Quem somos", eyebrow: "Institucional", h1: "Energia solar com <span class='accent'>quem entende do Norte</span>", lead: "Desde 2014 projetando, instalando e mantendo sistemas fotovoltaicos no Amazonas e na Região Norte — com parceiros em todo o Brasil.", image: "flow/cena-3-casa.webp", imageAlt: "Residência moderna com painéis solares instalados" },
  schema: [
    { "@type": "AboutPage", name: "Quem somos — HardSol Energia Solar", url: BASE + "/quem-somos.html", inLanguage: "pt-BR", about: { "@id": ORG_ID } },
    WEBSITE,
  ],
  body: [
    section(`<div class="prose">
      <p>A <strong>HardSol Energia Solar</strong> nasceu em 2014 de uma preocupação simples: gerar energia limpa de forma acessível. De lá para cá, virou especialista em microgeração fotovoltaica — da análise de viabilidade e elaboração do projeto até a instalação e o pós-venda.</p>
      <p>Atuamos em todo o estado do Amazonas, na Região Norte e, com parceiros, em todo o Brasil.</p>
    </div>`),
    section(
      `<div class="section-head"><span class="num">Nossos princípios</span><h2>Missão, visão e política</h2></div>
      <div class="values">
        <div class="value" data-reveal><h3>Missão</h3><p>Oferecer a solução de energia limpa com o melhor custo-benefício e nos tornar referência em eficiência energética.</p></div>
        <div class="value" data-reveal><h3>Visão</h3><p>Difundir a geração fotovoltaica e contribuir com um futuro sustentável, com mais qualidade de vida e energia acessível.</p></div>
        <div class="value" data-reveal><h3>Política</h3><p>Conscientizar sobre o uso de energia renovável, atuando de forma ativa na promoção da sustentabilidade.</p></div>
      </div>`,
      "section section--soft"
    ),
    section(
      `<div class="stats">
        <div class="stat" data-reveal><b><span data-count="${TOTAL_KWP}">0</span> kWp</b><span>Instalados no portfólio</span></div>
        <div class="stat" data-reveal><b><span data-count="12">0</span></b><span>Obras em destaque</span></div>
        <div class="stat" data-reveal><b><span data-count="${STATES}">0</span></b><span>Estados atendidos</span></div>
        <div class="stat" data-reveal><b><span data-count="2014">0</span></b><span>Atuando desde</span></div>
      </div>`
    ),
    section(
      `<div class="feature feature--split">
        <div data-reveal>
          <div class="section-head" style="margin-bottom:1rem"><span class="num">Depoimentos</span><h2>Histórias de sucesso</h2></div>
          <p class="lead">Veja o depoimento de quem acompanhou de perto o nosso trabalho — e um pouco da nossa experiência em projetos fotovoltaicos, eficiência energética e reaproveitamento de recursos naturais.</p>
        </div>
        <div data-reveal>
          <div style="position:relative;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#0b0e1f;box-shadow:var(--shadow-md)">
            <iframe src="https://www.youtube.com/embed/Xu_NYPAjhHU" title="Depoimento de alunos — HardSol Energia Solar" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>
          </div>
        </div>
      </div>`,
      "section section--soft"
    ),
    section(
      `<div class="section-head"><span class="num">Onde estamos</span><h2>Filiais e representantes</h2></div>
    <div class="grid grid--3">
      ${[
        ["Maceió-AL | Recife-PE", "Janderson Andrade", "(82) 99626-2545", "Vila dos Bancários Nº 8C, Poço, Maceió-AL, CEP 57.025-290"],
        ["Belém - PA", "Pablo Monte", "(91) 99913-9940", "Av. Gentil Bittencourt nº 2397, São Brás, Belém-PA, CEP 66.063-022"],
        ["Porto Velho - RO", "Ivo Pereira", "(69) 99996-8835", "Rua Petrônio Ferreira, 2745 JK2, Juscelino Kubitschek, Porto Velho-RO, CEP 76.829-314"],
        ["Rio de Janeiro - RJ", "Felipe Mendes", "(22) 98833-1521", "Rua Dallas, 18, Parque Estoril, São Pedro da Aldeia-RJ, CEP 28.943-172"],
        ["Macapá - AP", "Nelvani Baroso", "(96) 99131-0677", "Rua Padre Vitório Galianne Nº 343, Nova Esperança, Macapá-AP, CEP 68901-600"],
        ["Boa Vista - RR", "Marcley dos Santos", "(95) 99123-8076", "Av. Minas Gerais, 265, Bairro dos Estados, Boa Vista-RR, CEP 69.035-660"],
      ].map(([city, name, phone, addr]) => `<div class="value" data-reveal><h3>${esc(city)}</h3><p><strong>${esc(name)}</strong><br />${esc(phone)}<br />${esc(addr)}</p></div>`).join("\n      ")}
    </div>`),
    ctaBand(),
  ].join("\n"),
});

// ---- Serviços (hub)
pages["servicos.html"] = layout({
  file: "servicos.html",
  current: "servicos.html",
  title: "Serviços — HardSol Energia Solar",
  desc: "Projetos e instalações fotovoltaicas, carregamento de carros elétricos, aquecimento e bombeamento de água solar, elétrica e pós-venda.",
  hero: { crumb: "Serviços", eyebrow: "O que fazemos", h1: "Soluções completas em <span class='accent'>energia solar</span>", lead: "Do projeto ao pós-venda, cobrimos toda a jornada da geração de energia limpa.", image: "flow/cena-2-paineis.webp", imageAlt: "Fileiras de painéis solares sob a luz do sol" },
  schema: [
    { "@type": "CollectionPage", name: "Serviços — HardSol Energia Solar", url: BASE + "/servicos.html", inLanguage: "pt-BR" },
    itemList("Serviços da HardSol", SERVICES.map((s) => ({ name: s.title, url: abs(s.slug) }))),
  ],
  body: [section(`<div class="grid grid--3">${SERVICES.map((s) => serviceCard(s, "")).join("\n      ")}</div>`), ctaBand()].join("\n"),
});

// ---- Páginas de serviço
SERVICES.forEach((s) => {
  const depth = "../";
  const gallery = s.gallery
    ? section(
        `<div class="section-head"><span class="num">Galeria</span><h2>Alguns pós-venda</h2></div>
      <div class="grid grid--3">
        ${s.gallery.map((g) => `<div class="card__media" style="border-radius:14px;overflow:hidden"><img src="${depth}assets/img/${g}" alt="Serviço de pós-venda HardSol" loading="lazy" /></div>`).join("\n        ")}
      </div>`,
        "section section--soft"
      )
    : "";
  pages[s.slug] = layout({
    file: s.slug,
    base: depth,
    current: "servicos.html",
    title: s.title + " — HardSol Energia Solar",
    desc: s.blurb,
    hero: { crumb: "Serviços", eyebrow: s.meta, h1: esc(s.title), lead: esc(s.blurb), image: s.hero, imageAlt: s.title },
    schema: [
      { "@type": "Service", name: s.title, description: s.blurb, serviceType: s.meta, url: abs(s.slug), provider: { "@id": ORG_ID }, areaServed: ["Amazonas", "Região Norte", "Brasil"], availableChannel: { "@type": "ServiceChannel", serviceUrl: abs(s.slug) } },
    ],
    body: [section(`<div class="prose">${s.body}</div>`), gallery, relatedServices(depth, s.slug), ctaBand()].join("\n"),
  });
});

// ---- Trabalhos (portfólio com filtro + números)
pages["trabalhos.html"] = layout({
  file: "trabalhos.html",
  current: "trabalhos.html",
  title: "Trabalhos concluídos — HardSol Energia Solar",
  desc: "Portfólio de projetos de energia solar OnGrid e OffGrid em Manaus, Região Norte e Brasil, com potência, equipamentos, geração e economia.",
  hero: { crumb: "Trabalhos", eyebrow: "Portfólio", h1: "Projetos que já estão <span class='accent'>gerando economia</span>", lead: "Sistemas projetados, instalados e homologados em todo o Norte e com parceiros no Brasil. Filtre por tipo de instalação.", image: "flow/cena-6-cidade.webp", imageAlt: "Painéis solares brilhando sobre a cidade ao entardecer" },
  schema: [
    { "@type": "CollectionPage", name: "Trabalhos concluídos — HardSol Energia Solar", url: BASE + "/trabalhos.html", inLanguage: "pt-BR" },
    itemList("Projetos de energia solar concluídos", WORKS.map((w) => ({ name: `${w.title} — ${w.loc}`, url: BASE + "/trabalhos.html" }))),
  ],
  body: [
    section(
      `<div class="stats">
        <div class="stat" data-reveal><b><span data-count="${TOTAL_KWP}">0</span> kWp</b><span>Potência instalada</span></div>
        <div class="stat" data-reveal><b><span data-count="${WORKS.length}">0</span></b><span>Obras em destaque</span></div>
        <div class="stat" data-reveal><b><span data-count="${STATES}">0</span></b><span>Estados atendidos</span></div>
        <div class="stat" data-reveal><b><span data-count="2014">0</span></b><span>Atuando desde</span></div>
      </div>`
    ),
    section(
      `<div class="filters" role="group" aria-label="Filtrar trabalhos por tipo">
        <button class="filter is-active" data-filter="todos" aria-pressed="true">Todos</button>
        <button class="filter" data-filter="residencial" aria-pressed="false">Residencial</button>
        <button class="filter" data-filter="comercial" aria-pressed="false">Comercial</button>
        <button class="filter" data-filter="predial" aria-pressed="false">Predial</button>
      </div>
      <div class="grid grid--3" id="works-grid">
        ${WORKS.map((w) => workCard(w, "")).join("\n        ")}
      </div>`
    ),
    ctaBand("Seu projeto pode ser o próximo"),
  ].join("\n"),
});

// ---- Sustentabilidade
const ODS = [
  ["ODS 6 · Água potável e saneamento", "Reaproveitar a água da chuva e reduzir a dependência de água tratada.", "A sede possui captação de água da chuva, usada na irrigação das áreas verdes e em atividades que não exigem água tratada (banheiros e limpeza)."],
  ["ODS 7 · Energia limpa e acessível", "Consumir a energia que nós mesmos geramos.", "São 70 painéis fotovoltaicos instalados na própria sede: energia renovável, barata e confiável, reduzindo a dependência de combustíveis fósseis."],
  ["ODS 11 · Cidades e comunidades sustentáveis", "Construir de forma mais inteligente e responsável.", "A sede foi erguida com argamassas ACIII da SUAM, produzidas a partir da reciclagem de vidro — um exemplo do que defendemos."],
  ["ODS 12 · Consumo e produção responsáveis", "Reduzir, reutilizar e reciclar no dia a dia.", "Separação de recicláveis, treinamentos periódicos, uso de canecas reutilizáveis, impressão frente e verso e digitalização de documentos."],
];

pages["sustentabilidade.html"] = layout({
  file: "sustentabilidade.html",
  current: "sustentabilidade.html",
  title: "Sustentabilidade — HardSol Energia Solar",
  desc: "A nossa sede é o primeiro projeto: 70 painéis fotovoltaicos, captação de água da chuva e reciclagem. Ações alinhadas aos ODS 6, 7, 11 e 12.",
  hero: { crumb: "Sustentabilidade", eyebrow: "Compromisso", h1: "Sustentabilidade que a gente <span class='accent'>pratica</span>", lead: "Energia solar é o nosso negócio — mas também é o nosso jeito de operar. A nossa sede é o primeiro projeto em que aplicamos tudo o que defendemos.", image: "flow/cena-1-amanhecer.webp", imageAlt: "Painéis solares ao amanhecer" },
  schema: [{ "@type": "WebPage", name: "Sustentabilidade — HardSol Energia Solar", url: BASE + "/sustentabilidade.html", inLanguage: "pt-BR" }],
  body: [
    section(
      `<div class="stats">
        <div class="stat" data-reveal><b><span data-count="70">0</span></b><span>Painéis na nossa sede</span></div>
        <div class="stat" data-reveal><b><span data-count="4">0</span></b><span>ODS prioritários</span></div>
        <div class="stat" data-reveal><b><span data-count="100" data-suffix="%">0</span></b><span>Recicláveis separados</span></div>
        <div class="stat" data-reveal><b><span data-count="2014">0</span></b><span>Compromisso desde</span></div>
      </div>
      <p style="margin-top:1.2rem"><a class="btn btn--dark" href="contato.html">Fale com a gente</a></p>`
    ),
    section(
      `<div class="section-head"><span class="num">Objetivos Globais</span><h2>Os ODS que perseguimos</h2>
      <p class="lead">Em 2015, os líderes mundiais acordaram 17 Objetivos de Desenvolvimento Sustentável para 2030. Estamos além da metade do caminho e apenas 15% deles estão no ritmo certo — por isso agimos onde temos impacto real.</p></div>
      <div class="grid grid--2">
        ${ODS.map(([t, sub, txt]) => `<div class="card" data-reveal><div class="card__body"><span class="card__meta">${esc(t)}</span><h3 style="font-size:1.05rem">${esc(sub)}</h3><p>${esc(txt)}</p></div></div>`).join("\n        ")}
      </div>`,
      "section section--soft"
    ),
    section(
      `<div class="section-head"><span class="num">Na prática</span><h2>Nossas diretrizes</h2></div>
      <div class="values">
        <div class="value" data-reveal><h3>Identificação e separação</h3><p>Lixeiras específicas para papel, plástico, vidro e metal.</p></div>
        <div class="value" data-reveal><h3>Educação e conscientização</h3><p>Treinamentos e campanhas regulares, com participação ativa da equipe.</p></div>
        <div class="value" data-reveal><h3>Redução de resíduos</h3><p>Canecas reutilizáveis, impressão frente e verso e digitalização de documentos.</p></div>
        <div class="value" data-reveal><h3>Parcerias</h3><p>Empresas locais de reciclagem para destinar corretamente cada material.</p></div>
      </div>`
    ),
    ctaBand("Quer gerar energia limpa com a HardSol?"),
  ].join("\n"),
});

// ---- Contato
pages["contato.html"] = layout({
  file: "contato.html",
  current: "contato.html",
  title: "Contato — HardSol Energia Solar",
  desc: "Fale com a HardSol Energia Solar em Manaus/AM. WhatsApp (92) 99348-3553, pós-venda (92) 99267-2491. Solicite uma simulação gratuita.",
  hero: { crumb: "Contato", eyebrow: "Fale conosco", h1: "Solicite um <span class='accent'>orçamento</span>", lead: "Conte pra gente sobre o seu consumo e o seu projeto. A partir disso montamos uma proposta com geração estimada, potência do sistema e retorno do investimento.", image: "flow/cena-4-carro.webp", imageAlt: "Carro elétrico carregando em garagem solar" },
  schema: [
    { "@type": "ContactPage", name: "Contato — HardSol Energia Solar", url: BASE + "/contato.html", inLanguage: "pt-BR", about: { "@id": ORG_ID } },
    { "@type": "LocalBusiness", "@id": BASE + "/#localbusiness", telephone: "+55-92-99348-3553", address: { "@type": "PostalAddress", addressLocality: "Manaus", addressRegion: "AM", addressCountry: "BR" } },
  ],
  body: section(
    `<div class="grid grid--2">
      <div data-reveal>
        <h2>Contatos</h2>
        <ul class="contact-list">
          <li><span class="label">Comercial / WhatsApp</span><a href="${WHATS}" target="_blank" rel="noopener">(92) 99348-3553</a></li>
          <li><span class="label">Pós-venda</span><a href="tel:+5592992672491">(92) 99267-2491</a></li>
          <li><span class="label">Localização</span><span>Manaus — Amazonas — Brasil</span></li>
          <li><span class="label">Atuação</span><span>Amazonas, Região Norte e parceiros em todo o Brasil</span></li>
          <li><span class="label">YouTube</span><a href="https://www.youtube.com/watch?v=Xu_NYPAjhHU" target="_blank" rel="noopener">Histórias de sucesso</a></li>
        </ul>
      </div>
      <div data-reveal>
        <h2>Mensagem rápida</h2>
        <form id="contact-form" novalidate>
          <p><label for="cf-name">Nome</label><br /><input id="cf-name" name="nome" required style="width:100%;padding:.8rem 1rem;border-radius:12px;border:1px solid var(--line-2);background:#fff;color:var(--ink)" /></p>
          <p><label for="cf-phone">Telefone</label><br /><input id="cf-phone" name="telefone" inputmode="tel" style="width:100%;padding:.8rem 1rem;border-radius:12px;border:1px solid var(--line-2);background:#fff;color:var(--ink)" /></p>
          <p><label for="cf-msg">Mensagem</label><br /><textarea id="cf-msg" name="mensagem" rows="5" style="width:100%;padding:.8rem 1rem;border-radius:12px;border:1px solid var(--line-2);background:#fff;color:var(--ink)"></textarea></p>
          <button class="btn btn--solar" type="submit">Enviar pelo WhatsApp</button>
        </form>
      </div>
    </div>`,
    "section section--soft"
  ),
  inlineScript: `<script>
  (function(){
    var f=document.getElementById("contact-form");
    if(!f) return;
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var n=f.nome.value.trim(), t=f.telefone.value.trim(), m=f.mensagem.value.trim();
      if(!n){ f.nome.focus(); return; }
      var txt="Olá! Meu nome é "+n+(t?" ("+t+")":"")+". "+m;
      window.open("https://api.whatsapp.com/send?phone=5592993483553&text="+encodeURIComponent(txt),"_blank","noopener");
    });
  })();
  </script>`,
});

/* ---------------------------------- escrita ------------------------------- */

let count = 0;
Object.keys(pages).forEach((file) => {
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, pages[file].replace(/\n{3,}/g, "\n\n"));
  count++;
  console.log("  wrote " + file);
});
console.log("OK  " + count + " páginas.  (base=" + BASE + ", kWp=" + TOTAL_KWP + ", estados=" + STATES + ")");
