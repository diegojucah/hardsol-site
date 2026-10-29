# 04 · Build (estático + cinematic scroll)

## Arquitetura

Sem build no deploy. Um gerador em `node` produz o HTML; o site são arquivos estáticos.

```
index.html · sobre.html · servicos.html · contato.html
assets/css/{style.css, film.css, form.css}
assets/js/{film.js, loader.js, motion.js, nav.js, connect.js}
assets/img/...   frames/{desktop,mobile}/...   tools/build-pages.js
```

Por que gerador e não HTML à mão: header/footer/form/JSON-LD ficam em **um lugar**;
12–20 páginas sem divergência de contato ou canonical.

## Motor do cinematic scroll

```html
<section class="scroll-film" style="--film-height: 450vh"
         data-frame-count="97"
         data-frames-desktop="frames/desktop"
         data-frames-mobile="frames/mobile">
  <canvas id="film" width="1280" height="720" aria-hidden="true"></canvas>
  <div class="film-captions">…</div>
  <div class="film-vignette"></div>
  <div class="film-beam"><i></i><i></i></div>
  <div class="film-progress"><i></i></div>
</section>
```

```css
.scroll-film { height: var(--film-height); position: relative; }
#film { position: sticky; top: 0; width: 100%; height: 100vh; }
```

### Regras que evitam o "pula imagem"

1. **Passes densos** `[8,4,2,1]`; libera o preloader no passe de passo 2 (~metade dos frames).
2. Se o frame exato ainda não chegou, **mantenha o quadro atual**. Nunca desenhe um vizinho
   distante — é isso que faz "surgirem várias imagens" no scroll.
3. `progress = clamp(-rect.top / (altura - innerHeight), 0, 1)` com `rAF` e flag `ticking`.
4. Desenho `cover`: `s = max(cw/iw, ch/ih)`, centralizado, com `devicePixelRatio` limitado a 1.5.
5. Legendas em overlay **fixed** (não sticky) e com saída de cena antes do fim
   (`opacity → 0` entre 90% e 99%), senão elas ficam por cima da seção seguinte.

### Impacto barato

- **zoom**: `scale = 1 + 0.075 * smoothstep(progress)` no `drawImage`
- **feixe**: gradiente inclinado em `mix-blend-mode: screen`, posição por `--bx`
- **vinheta**: `radial-gradient` fixo, sem custo de JS
- nada disso usa WebGL; só desenhe de novo quando índice **ou** zoom mudarem

### Pipeline de frames

```bash
# 1 vídeo → frames WebP (12 fps é suficiente para scrub)
ffmpeg -i filme.mp4 -vf "scale=1280:720:flags=lanczos,eq=contrast=1.06:saturation=1.08" \
  -c:v libwebp -quality 70 frames/desktop/frame_%04d.webp
ffmpeg -i filme.mp4 -vf "scale=840:472:flags=lanczos" \
  -c:v libwebp -quality 68 frames/mobile/frame_%04d.webp
```

Peso-alvo: **≤ 5 MB desktop / ≤ 2,5 MB mobile** para ~100 frames. Acima disso, reduza fps
ou a resolução antes de reduzir a qualidade.

## CLS e performance

- todo `<img>` com `width` e `height`; card com `aspect-ratio`
- `loading="lazy"` + `decoding="async"` fora da primeira dobra
- hero com `<link rel="preload" as="image">`
- CSS crítico inline quando o projeto for pequeno; um único arquivo grande caso contrário

## SEO técnico

- `lang`, `title`, `description`, `canonical`, OG/Twitter por página
- JSON-LD: `Organization` (global), `Service`, `ItemList`, `BreadcrumbList`, `NewsArticle` no blog
- `sitemap.xml` + `robots.txt` + `llms.txt` (para agentes)
- um `h1` por página

## Formulário

`appearance: none`, foco visível, `aria-live`, estado `idle|loading|success|error`,
`onSubmit` com payload JSON limpo:

```json
{ "source": "site", "page": "/", "submittedAt": "ISO", "fields": { "nome": "", "telefone": "" } }
```

POST para webhook (n8n). Sem webhook configurado → fallback WhatsApp, para não perder lead.

## Auditoria de densidade

```js
// palavras por imagem, por página — alvo 60 a 400
```

Página só de imagem não converte e não indexa; página só de texto não respira.
