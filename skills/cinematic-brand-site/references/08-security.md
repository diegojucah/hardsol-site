# 08 · Segurança

O site precisa ser **seguro de fato**, não parecer. Site estático reduz a superfície, mas
cabeçalho, formulário e DNS continuam sendo pontos de falha.

## Cabeçalhos (`_headers` no Cloudflare Pages)

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.whatsapp.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY
```

Regras:

- **nenhum script de terceiros** (sem GA, sem pixel, sem chat embedado)
- CSS e JS próprios → CSP **sem** `unsafe-inline`; nada de `onclick` no HTML
- métrica: Cloudflare Web Analytics (sem cookie) se necessário
- `font-src` só para o domínio de fontes usado; se self-host, remova o externo

## Formulário

- validação no cliente **e** no servidor (n8n) — cliente nunca é confiável
- honeypot invisível (`display:none` + `tabindex="-1"`) e time-trap (< 3 s = bot)
- rate limit no Cloudflare (ex.: 5 req/min por IP na rota do webhook)
- nenhuma chave secreta no HTML; o webhook valida origem e campos
- resposta genérica: não confirma existência de e-mail/telefone

## DNS e transporte

- DNSSEC ligado na Cloudflare
- **CAA** restringindo emissão a `letsencrypt.org` e `pki.goog`
- *Always Use HTTPS* + HSTS
- `.well-known/security.txt` com contato para relato de vulnerabilidade

## Conteúdo

- imagens hospedadas localmente; nunca hotlink de CDN de terceiro
- sem `target="_blank"` sem `rel="noopener noreferrer"`
- revisar dependências: alvo é **zero** dependência de runtime
- não versionar `.env`, chaves ou tokens; `webhook` vazio por padrão

## Verificação

```bash
curl -sI https://dominio/ | grep -iE 'strict-transport|content-security|x-content-type|referrer|permissions'
# https://securityheaders.com  ·  https://observatory.mozilla.org
```
