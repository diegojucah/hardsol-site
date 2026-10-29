# 06 · Domínio, DNS e SSL

## 1. Verificar disponibilidade (RDAP, sem whois)

```bash
bash scripts/domain-check.sh empresa.com.br empresa.com empresaeng.com.br
```

RDAP responde JSON e não tem captcha:

- `.com.br` → `https://rdap.registro.br/domain/<dominio>`
- `.com` / `.net` → `https://rdap.verisign.com/com/v1/domain/<dominio>`

`404` = livre. `200` = registrado (o corpo traz `expiration` e o registrante).

## 2. Árvore de decisão

```
.com.br livre?
├── sim → registrar no registro.br (R$ ~40/ano) e usar como principal
└── não → é a MESMA empresa? (CNPJ/telefone/endereço/link na bio)
          ├── sim, e ela quer trocar de host → falar com quem tem o acesso (não registre)
          └── não → NÃO use variação enganosa
                    ├── .com livre? → registrar (principal)
                    └── senão → sufixo honesto: <marca>al.com.br, <marca>eng.com.br
```

**Nunca** registre um nome que se confunde com concorrente para "pegar o tráfego".
Risco jurídico (marca) e comercial.

## 3. Aponte para o Cloudflare Pages

Com o DNS **na Cloudflare** (nameservers `*.ns.cloudflare.com`):

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| CNAME | `www` | `<slug>.pages.dev` | Proxied |
| CNAME | `@` (flattening) | `<slug>.pages.dev` | Proxied |

Com DNS em outro provedor (registro.br, por exemplo):

- `www` → `CNAME <slug>.pages.dev`
- apex → `ALIAS/ANAME` se o provedor suportar; senão, `A` para os IPs do Pages
  e **só** depois de validar no painel.

No Pages: **Custom domains → Set up a domain** → adicione `www` e o apex.
SSL é emitido automaticamente (Universal SSL). Ative *Always Use HTTPS*.

## 4. Antes de mudar nameservers: e-mail

Se a empresa usa **e-mail no domínio** (`contato@empresa.com.br`), os registros `MX`
estão no DNS atual. Ao migrar para a Cloudflare, **recrie MX, SPF, DKIM e DMARC** antes
de trocar os nameservers — senão o e-mail para de chegar.

Checklist de migração:

- [ ] exportei a zona DNS atual (print/JSON)
- [ ] recriei MX, TXT (SPF), DKIM, DMARC, e subdomínios de e-mail (mail, autodiscover)
- [ ] validei com `dig MX <dominio>` e um envio de teste
- [ ] só então troquei os nameservers

## 5. Validação final

```bash
dig +short www.<dominio>
dig +short <dominio>
curl -sI https://<dominio> | head -5      # 200 + strict-transport-security
curl -sI http://<dominio>  | head -1      # 301 para https
```

## 6. Quem é o dono

O domínio deve ficar **no nome do cliente** (ou do contrato). Se você registra no seu nome,
documente a transferência prevista — isso evita a percepção de refém.
