# Publicação e indexação

## Onde o site está publicado

**GitHub Pages** — https://diegojucah.github.io/hardsol-site/

- Repositório: https://github.com/diegojucah/hardsol-site (público)
- Branch publicada: `main`, raiz do repositório (`/`), com `.nojekyll` na raiz.
- Publicar mudanças = **`git push`** na `main`. O Pages reconstrói sozinho (leva ~1–2 min).

```bash
git add -A
git commit -m "descrição da mudança"
git push origin main
```

---

## Quando o domínio próprio chegar

Trocar o domínio é um comando só — ele reescreve canonical, `og:url`, `og:image`,
`sitemap.xml`, `robots.txt` e `llms.txt`, e atualiza `site.config.json`:

```bash
node tools/set-site-url.js https://www.hardsol.com.br
node tools/build-pages.js        # regenera as internas já com a nova URL
git add -A && git commit -m "domínio próprio" && git push origin main
```

No GitHub Pages, adicione o domínio em **Settings → Pages → Custom domain**
(e crie o arquivo `CNAME` se usar apex/www). Depois marque *Enforce HTTPS*.

---

## Indexação nos buscadores

O que **já está pronto** no site:

| Recurso | Caminho | Para quê |
|---|---|---|
| `robots.txt` | `/robots.txt` | Libera todos os buscadores **e** os crawlers de IA |
| `sitemap.xml` | `/sitemap.xml` | 12 URLs, referenciado no `robots.txt` |
| Metas | todas as páginas | `robots`, `canonical`, Open Graph, Twitter Card |
| JSON-LD | todas as páginas | Organization, WebSite, LocalBusiness, Service, ItemList, BreadcrumbList |
| IndexNow | chave em `/<chave>.txt` | Notificação imediata a Bing, Yandex, Seznam e Naver |

**IndexNow já foi disparado** para as 12 URLs (HTTP 202). Para reenviar após
mudanças de conteúdo:

```bash
bash tools/submit-indexnow.sh
```

### Passos que dependem da sua conta (não automatizáveis)

1. **Google Search Console** — https://search.google.com/search-console
   Adicione a propriedade (prefixo de URL) e verifique. O Google oferece verificação
   por **arquivo HTML** ou **tag HTML**; se escolher a tag, cole o código em
   `tools/build-pages.js` (no `<head>`) e no `index.html`, depois rode `build-pages` e o push.
   Em **Sitemaps**, envie `sitemap.xml`.
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   Importa direto do Search Console. O IndexNow já cobre o Bing.
3. **DuckDuckGo / Yandex / outros** — indexam por conta própria a partir do
   `sitemap.xml`; não exigem cadastro.

> Dica: com o domínio próprio em HTTPS, o Google confia e ranqueia melhor. O
> subdomínio `github.io` é ótimo para validação, mas é temporário.

---

## Visibilidade por agentes de IA

| Arquivo | Conteúdo |
|---|---|
| `/llms.txt` | Resumo curado: o que a empresa faz, serviços, contatos e links |
| `/llms-full.txt` | Texto completo das 12 páginas, em Markdown, numa só requisição |

O `robots.txt` libera explicitamente `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`,
`ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`,
`Amazonbot`, `cohere-ai`, `meta-externalagent`, `Bytespider` e `CCBot`.

O HTML é **semântico** (um `h1` por página, `main`, `nav`, `footer`, `breadcrumb`) e o
conteúdo é texto real — não só imagem —, o que é o que permite a leitura por agentes.

Regerar o `llms-full.txt` depois de mudar o texto das páginas:

```bash
node tools/build-llms-full.js
```

---

## Outros hosts grátis (alternativas)

O site é 100% estático e **não exige build** — qualquer host serve. Se quiser um
subdomínio com nome da marca:

- **Netlify** — `npx netlify-cli deploy --prod --dir .` (precisa do seu login)
- **Cloudflare Pages** — `npx wrangler pages deploy .`
- **Surge** — `npx surge . hardsol.surge.sh`
- **Vercel** — `npx vercel --prod`

Em todos, publique a **raiz do repositório** e **exclua** `tools/`, `.preview/` e
`docs/`. Lembre de rodar `node tools/set-site-url.js <nova-url>` antes, para as URLs
canônicas ficarem corretas.
