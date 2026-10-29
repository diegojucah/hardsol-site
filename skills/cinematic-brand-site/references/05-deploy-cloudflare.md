# 05 · Deploy no Cloudflare Pages

## Criar e publicar

```bash
npm i -D wrangler
npx wrangler login                       # abre o navegador uma vez
npx wrangler pages project create <slug> --production-branch main
npx wrangler pages deploy . --project-name <slug>
```

Saída: `https://<slug>.pages.dev` (produção) e uma preview por deploy.

## O que publicar

Publique **somente** o site. Antes do deploy:

```bash
# exclua do diretório de deploy
rm -rf tools node_modules docs .git skills
```

Ou use um diretório de saída (`dist/`) e copie só HTML/CSS/JS/assets.

## Cabeçalhos e cache

`_headers` na raiz do deploy:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/frames/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

`_redirects`:

```
/servicos  /servicos.html  301
/contato   /contato.html   301
```

## Limites que importam

| Item | Limite |
|---|---|
| Arquivos por deploy | 20.000 |
| Tamanho por arquivo | 25 MB |
| Builds/mês (free) | 500 |

Nosso caso: ~60 arquivos, frames de 30–50 KB. Folgado.

## Desenvolvimento local

```bash
npx wrangler pages dev . --port 8788
# preview fiel ao Pages (headers, redirects, 404)
```

## CI (opcional)

```yaml
# .github/workflows/deploy.yml
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx wrangler pages deploy . --project-name <slug>
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Token com permissão **Cloudflare Pages: Edit** apenas.

## Checklist

- [ ] `pages.dev` em 200 e HTTPS
- [ ] todas as rotas em 200 (inclusive subpastas)
- [ ] `_headers` aplicado (conferir `cache-control` no `curl -I`)
- [ ] deploy não contém `node_modules`, `tools`, `.git`
