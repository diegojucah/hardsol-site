# HardSol Energia Solar — site "Cinematic Scroll"

Site da **HardSol Energia Solar** (Manaus/AM) no método **Cinematic Scroll**:
um filme é "passado" pelo scroll num `<canvas>` fixo (sticky), seguido das seções
de conteúdo. HTML/CSS/JS estático — **não exige build no deploy**.

Referência (site antigo): https://www.hardsol.com.br/
Método: https://studio.gaven.in/blog/how-to-build-a-cinematic-scroll-website

---

## Identidade visual

Derivada do site original da HardSol:

| Uso | Cor |
|---|---|
| Destaque (âmbar) | `#FFBC3B` · hover `#FFAB08` · tint `#FFF7E6` |
| Secundária (azul) | `#041581` · `#1E1E4B` · tint `#EEF0FB` |
| Texto | `#1A1A37` · apoio `#5C5C77` / `#8585A4` |
| Fundos | `#FFFFFF` · `#F8F8FB` · `#EDEDF3` |
| Superfície escura (filme/rodapé) | `#0B0E1F` |

**Tema claro**: o site é predominantemente branco. O único momento escuro é o
**filme** no topo da home (e o preloader que o precede).

**Tipografia: Poppins** (300/400/500/600/700) — a mesma fonte do site original.
Títulos em 600/700, corpo em 400.

Variáveis em `assets/css/style.css` (`:root`).

---

## Como funciona o filme

O vídeo **nunca é tocado**: a home tem uma seção alta (`.scroll-film`) com um
`<canvas>` `position: sticky`. O progresso do scroll escolhe o frame e o desenha.

- `assets/js/loader.js` — carregamento **coarse-to-fine** (16 → 8 → 4 → 2 → 1).
- `assets/js/film.js` — scroll → frame, legendas por faixa de progresso, preloader.
- `assets/js/nav.js` — header (claro sobre o filme / branco depois), menu, reveal,
  contadores e **filtro do portfólio**.
- `assets/css/film.css` — canvas sticky, legendas em overlay fixo e o fallback
  para `prefers-reduced-motion`.

Estado atual: **217 frames reais** (cenas 1 e 2, ~18s), extraídos a 12 fps dos
vídeos gerados no Google Flow.

> Para estender o filme: gere as cenas restantes, rode `bash tools/prepare-flow-assets.sh`
> e atualize no `index.html` o `data-frame-count`, a altura (`--film-height`) e as
> legendas (`.film-caption` com `data-from` / `data-to`).

---

## Estrutura

```
├── index.html                  # home cinematográfica
├── quem-somos.html · servicos.html · trabalhos.html
├── sustentabilidade.html · contato.html
├── servicos/  (6 páginas)
├── assets/
│   ├── css/{style.css, film.css}
│   ├── js/{loader.js, film.js, nav.js, vendor/lenis.min.js}
│   └── img/
│       ├── flow/     # 6 stills 2K do Flow (full + card)
│       ├── trabalhos/ # fotos reais das obras
│       ├── servicos/ · posvenda/ · about/
├── frames/{desktop,mobile}/    # sequência WebP do filme
├── tools/                      # geradores e scripts (dev-only)
├── robots.txt · sitemap.xml · llms.txt · llms-full.txt
├── site.config.json           # URL base do site (usada pelo gerador)
└── docs/                      # prompts do Flow e guia de publicação
```

**Imagens:** as imagens do Flow são **ilustrativas** (ambientam serviços e
páginas). O portfólio de Trabalhos usa as **fotos reais** das instalações —
mantenha assim para não apresentar imagem gerada como obra entregue.

---

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

---

## Pipeline de mídia (dev)

```bash
# 1) prepara os ativos do Flow (stills 2K -> WebP; vídeos -> frames do filme)
bash tools/prepare-flow-assets.sh

# 2) regenera as páginas internas (a partir do layout compartilhado)
node tools/build-pages.js

# 3) verifica se todo href/src local existe
node tools/check-links.js
```

`tools/prepare-flow-assets.sh` move os originais da raiz para `tools/flow-source/`,
converte os stills para `assets/img/flow/` e encoda os vídeos
(`FPS=12 bash tools/encode-real-film.sh`) em `frames/desktop` e `frames/mobile`.

> Regra do método: **asse o grade** (contraste/saturação/sharpen) nos arquivos WebP,
> nunca em runtime no navegador.

---

## SEO, performance e acessibilidade

- `lang="pt-BR"`, título/descrição por página, Open Graph, **JSON-LD `LocalBusiness`**
  na home, `sitemap.xml` e `robots.txt`.
- Frames WebP (1600×900 desktop / 960×540 mobile) com carregamento coarse-to-fine.
- Canvas `aria-hidden`, legendas em texto real, skip-link, foco visível, contraste AA
  e fallback estático em `prefers-reduced-motion`.

---

## Publicação

**No ar em:** https://diegojucah.github.io/hardsol-site/ (GitHub Pages, repo público
[`diegojucah/hardsol-site`](https://github.com/diegojucah/hardsol-site), branch `main`).

Publicar mudanças é só fazer push — o Pages reconstrói sozinho:

```bash
git add -A && git commit -m "mudança" && git push origin main
```

Quando o domínio próprio chegar:

```bash
node tools/set-site-url.js https://www.hardsol.com.br
node tools/build-pages.js
git add -A && git commit -m "domínio próprio" && git push origin main
```

O site é 100% estático e **não exige build** — serve em qualquer host (Netlify,
Cloudflare Pages, Vercel, Surge ou a hospedagem atual via FTP).

**Indexação e agentes de IA:** `robots.txt` (liberando buscadores e crawlers de IA),
`sitemap.xml`, `llms.txt`, `llms-full.txt`, JSON-LD em todas as páginas e IndexNow já
disparado. Passo a passo e o que depende da sua conta (Google Search Console, Bing
Webmaster) em [`docs/publicacao-e-indexacao.md`](docs/publicacao-e-indexacao.md).

---

## Verificado nesta revisão

- 12 páginas em HTTP 200 · **0 links internos quebrados** (368 conferidos) ·
  `cursos.html` retorna 404 (área removida).
- Tema claro aplicado (fundo branco, Poppins), header claro sobre o filme e branco
  após o filme; filme real desenhando no canvas com as legendas trocando.
- Portfólio: filtro por tipo funciona (Todos 12 · Comercial 1 · Residencial ·
  Predial) e os números batem (148 kWp, 12 obras, 5 estados).

## Pendências

- **Gerar as cenas 3–6** no Flow (hoje o filme tem só as cenas 1 e 2).
- Substituir as fotos de baixa resolução do portfólio por fotos recentes das obras.
- Preencher "Obras em destaque" / números com os dados oficiais da HardSol.
- (Roadmap) Área de blog e camada de preparo para agentes (llms.txt, JSON-LD mais
  rico, HTML semântico e endpoints machine-readable).
