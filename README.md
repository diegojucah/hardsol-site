# HardSol Energia Solar — site "Cinematic Scroll"

Site da **HardSol Energia Solar** (Manaus/AM) no método **Cinematic Scroll**:
um filme é "passado" pelo scroll num `<canvas>` fixo (sticky), seguido das seções
de conteúdo. HTML/CSS/JS estático — **não exige build no deploy**.

Referência (site antigo): https://www.hardsol.com.br/
Método: https://studio.gaven.in/blog/how-to-build-a-cinematic-scroll-website

---

## Identidade visual

Estética inspirada no [sasgp.com.br](https://sasgp.com.br/) (fundo off-white quente,
container 1440px, gutter amplo, botões sólidos arredondados) com as **cores da HardSol**.

| Uso | Cor |
|---|---|
| Destaque (âmbar) | `#FFBC3B` · hover `#FFCD6E` · tint `#FFF3D6` |
| Secundária (azul) | `#041581` · hover `#2E36A8` · tint `#E8EAF7` |
| Texto | `#303030` · `#535050` · apoio `#686464` |
| Fundos | `#F9F7F7` (base) · `#F2EFEC` (alternado) · `#FFFFFF` (cards) |
| Superfície escura (filme) | `#0B0E1F` |

**Tipografia: Poppins** (300/400/500/600/700) — a fonte da marca.
**Container 1440px**, gutter `clamp(1.25rem, 4vw, 4.5rem)`.

Variáveis em `assets/css/style.css` (`:root`).

---

## Hero (imagem única)

O topo é **uma única imagem** (`assets/img/flow/hero.webp`, 142 KB / 32 KB no mobile),
com um **feixe de luz** que varre as placas continuamente (CSS, `hero.css`) e um véu
para dar contraste ao texto.

**Não há sequência de frames, canvas nem transições no scroll.** A versão anterior
desenhava 144 frames num `<canvas>` sticky (6,2 MB) e precisava de um preloader — daí a
lentidão. Agora o caminho crítico é HTML + CSS + 1 imagem.

> Para trocar a imagem do hero, substitua `assets/img/flow/hero.webp` (e
> `hero-mobile.webp`). O feixe e o véu são independentes da foto.

---

## Performance

| | Antes (filme de frames) | Agora (hero) |
|---|---|---|
| Carga inicial | ~6,2 MB de frames + preloader | **310 KB, 10 requisições** |
| Maior recurso | frame sequence | `hero.webp` 139 KB |
| JS no caminho crítico | Lenis + GSAP + ScrollTrigger (137 KB) | **0 KB** |

- **GSAP/ScrollTrigger/Lenis são carregados sob demanda** por `motion.js`
  (`requestIdleCallback`), depois da primeira pintura — e não são baixados se o
  visitante usa `prefers-reduced-motion`.
- Imagens de conteúdo são **WebP** e usam `loading="lazy"`.
- Fontes com `display=swap` e `preconnect`.

---

## Motion (scroll)

- **Lenis** — smooth scroll (instância única, em `assets/js/motion.js`).
- **GSAP + ScrollTrigger** — reveals, contadores, parallax e a **faixa horizontal
  fixada** das Soluções (`data-hscroll`, ativa só ≥900px).
- **Feixe de luz** — lâmina que varre as placas, animada em CSS (`hero.css`).
- Regra do método: **uma suavização só**. O Lenis move o scroll; o ScrollTrigger só lê
  a posição (o `scrub` não tem suavização própria, para não somar duas).

`motion.js` revela o conteúdo imediatamente com `IntersectionObserver` e só então
injeta as bibliotecas; se elas não carregarem, os reveals continuam funcionando.

---

## Estrutura da home

1. **Hero** — imagem única + feixe de luz
2. **Marcas** (faixa rolante)
3. **Para quem** — residências/condomínios e empresas/indústrias
4. **O que você precisa resolver?** — 6 necessidades numeradas, cada uma ligada ao serviço
5. **Soluções** — faixa horizontal fixada com os 6 serviços
6. **Nossa história** — imagens com parallax + números
7. **Histórias de sucesso** (vídeo) e **CTA final**

---

## Estrutura

```
├── index.html                  # home
├── quem-somos.html · servicos.html · trabalhos.html
├── sustentabilidade.html · contato.html
├── servicos/  (6 páginas)
├── assets/
│   ├── css/{style.css, hero.css}
│   ├── js/{motion.js, nav.js, vendor/}   # libs em vendor/ são carregadas sob demanda
│   └── img/
│       ├── flow/       # stills do Flow (hero, cenas, cards)
│       ├── trabalhos/  # fotos reais das obras (WebP)
│       └── posvenda/   # galeria do pós-venda (WebP)
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
# 1) prepara os ativos do Flow (stills 2K -> WebP em assets/img/flow)
bash tools/prepare-flow-assets.sh

# 2) regenera as páginas internas (a partir do layout compartilhado)
node tools/build-pages.js

# 3) verifica se todo href/src local existe
node tools/check-links.js
```

`tools/prepare-flow-assets.sh` move os originais da raiz para `tools/flow-source/` e
converte os stills do Flow para `assets/img/flow/`.

> Os scripts `tools/make_synthetic_film.js` e `tools/encode-real-film.sh` são um
> **legado** do modo "filme com frames": ficaram no repositório, mas o site **não os
> usa mais** (o topo agora é uma imagem única).

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

- 12 páginas em HTTP 200 · **0 links internos quebrados** (385 conferidos).
- **Carga inicial: 310 KB em 10 requisições** (antes: 6,2 MB de frames + preloader).
  GSAP/ScrollTrigger/Lenis entram depois da primeira pintura.
- Hero com imagem única (0 transições no scroll), feixe de luz ativo, header claro
  sobre o hero e sólido depois.
- Faixa horizontal das Soluções: seção fixada (`pin-spacer`) e trilho percorrendo
  até −972 px no desktop; em telas estreitas vira scroll por toque.
- Portfólio: filtro por tipo funciona (Todos 12 · Comercial 1 · Residencial ·
  Predial) e os números batem (148 kWp, 12 obras, 5 estados).

## Pendências

- Substituir as fotos de baixa resolução do portfólio por fotos recentes das obras.
- Preencher os números com os dados oficiais da HardSol.
- (Roadmap) Área de blog e camada de preparo para agentes (llms.txt, JSON-LD mais
  rico, HTML semântico e endpoints machine-readable).
