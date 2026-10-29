---
name: cinematic-brand-site
description: Turn an established company's public presence (Instagram, existing site, web) into a production cinematic-scroll website — brand scan, identity extraction, technical copy, build, Cloudflare deploy and domain checks. Use when the user gives an Instagram handle or company name and asks for a site, a redesign, a landing page, a "cinematic scroll" page, or a prospecting/outreach package.
license: MIT
metadata:
  author: HardSol Studio
  version: "1.0"
---

# Cinematic Brand Site

Pipeline para **criar valor em empresas já consolidadas** que têm presença social mas
não têm site (ou têm um site ruim): varrer a marca, interpretar a mensagem, projetar a
página, publicar e abordar o negócio.

Regra central: **nunca invente identidade**. Tudo que entrar no site precisa ter origem
rastreável (bio, post, site, CNPJ, catálogo). Se não houver fonte, marque como `[a confirmar]`.

---

## Quando usar

- "Faz um site para a @empresa" / "esse site aqui é ruim, refaz"
- "Preciso de uma landing page que pareça cinematográfica"
- "Analisa esse Instagram e monta a proposta"
- "Publica isso no Cloudflare e vê se o domínio está livre"

**Não use** para: app com backend, e-commerce com carrinho, site cujo conteúdo já existe
e é bom (aí é só redesign, pule para a Fase 4).

---

## As 7 fases

| # | Fase | Entregável | Aceite |
|---|---|---|---|
| 0 | Descoberta | dossiê + lacuna de valor | 3 fatos verificáveis com fonte |
| 1 | Varredura | `scan.md` (bio, posts, provas, contatos) | toda afirmação com link/origem |
| 2 | Identidade | `brand.json` + tokens | contraste AA conferido |
| 3 | Copy | textos por seção | zero palavra da lista proibida |
| 4 | Build | site estático publicado local | Lighthouse SEO ≥ 90 |
| 5 | Deploy | URL pública | HTTPS + 200 em todas as rotas |
| 6 | Domínio | registro + DNS + SSL | domínio próprio resolvendo |
| 7 | Negócio | diagnóstico de 1 página + oferta | gancho factual, sem promessa vazia |

---

### Fase 0 — Descoberta

Objetivo: saber **se vale** e **qual é a lacuna**.

```bash
bash scripts/site-audit.sh https://site-da-empresa.com.br
bash scripts/domain-check.sh empresa.com.br empresa.com
```

Decida a lacuna:

| Achado | Lacuna | Abordagem |
|---|---|---|
| Sem site | não existe presença própria | "seu Instagram é o site" |
| Site placeholder / template | conteúdo padrão | print do template como gancho |
| Site sem mobile / lento | experiência quebrada | mostrar no celular |
| Site bom, sem conversão | falta CTA/contato | otimização, ticket menor |

> **Cuidado de ouro:** confirme que o site que você achou é **da mesma empresa**.
> Nomes de construtora se repetem. Cheque CNPJ, endereço, telefone ou o link na bio.
> Se não bater, trate como **empresa sem site** — nunca critique site de terceiro.

Saída: `docs/dossie-<slug>.md` com 3 fatos + fonte + lacuna escolhida.

---

### Fase 1 — Varredura (Instagram + web)

O Instagram **exige sessão autenticada**: `web_fetch` cai em `/accounts/login`.
Use `agent-browser` com um perfil logado (ver `references/01-scan.md`).

Extraia, no mínimo:

- bio, link da bio, nome de exibição, categoria
- 9–12 posts recentes: legenda, tipo (obra/reforma/planejamento), local citado
- provas: depoimentos, antes/depois, números citados (m², prazo, unidades)
- contato: WhatsApp, e-mail, endereço
- vocabulário do setor usado pela empresa (o copy sai daqui, não de sinônimo genérico)

Saída: `scan.md` com uma tabela `afirmação → fonte (URL/post/data)`.
Poste só o que é público. Nunca baixe seguidores, DMs ou dados privados.

---

### Fase 2 — Identidade

Extraia cor e forma dos próprios ativos (fotos, logo, feed):

```bash
bash scripts/palette.sh ./assets/instagram/*.jpg
```

Monte `brand.json` a partir de `assets/brand.template.json`. Regras:

- **Contraste**: texto sobre fundo ≥ 4.5:1 (AA). Se a cor da marca não passa, escureça o
  texto — não mude a cor da marca.
- **Fundo nunca branco puro** se o pedido for "premium": use `#FAFAFA` / `#F7F7F9`.
- **Uma fonte** para título e corpo (geométrica ou humanista), no máximo 2 pesos.
- Tokens de sombra em 3 níveis e hover sempre suave (`translateY(-3px)` + sombra baixa).

Saída: `brand.json` + `assets/css/tokens.css`.

---

### Fase 3 — Copy

Regras em `references/03-copy.md`. O essencial:

- Proibido: *revolucione, desvende, descubra, jornada, transforme, eleve, mergulhe,
  no mundo de, soluções inovadoras, excelência em tudo*.
- Cada seção responde: **o que é → para quem → com que número → o que fazer agora**.
- Números em faixa quando não houver medição (`2 a 4 anos`, `15% a 22%`), nunca precisão falsa.
- Toda promessa precisa de lastro no `scan.md`. Sem fonte → `[a confirmar]`.

Saída: `content.md` com um bloco por seção e o CTA de cada uma.

---

### Fase 4 — Build

Site estático (HTML/CSS/JS + gerador em `node`), sem build no deploy. Estrutura e receitas
em `references/04-build.md`, incluindo o motor do cinematic scroll:

- `canvas` sticky + sequência de frames (coarse-to-fine **com hold**, nunca pular vizinho)
- feixe de luz e vinheta por CSS, sem custo de JS
- `width/height` em toda imagem (CLS), `loading="lazy"` fora do hero
- JSON-LD `Organization` + `LocalBusiness`; `Article` no blog
- densidade imagem/texto entre **60 e 400 palavras por imagem** (audite com script)

Aceite: `node tools/check-links.js` sem faltas; 200 em todas as páginas; zero `<img>` sem
dimensão.

---

### Fase 5 — Deploy no Cloudflare Pages

```bash
npm i -D wrangler
npx wrangler pages project create <slug> --production-branch main
npx wrangler pages deploy . --project-name <slug>
```

Publique só o site (exclua `tools/`, `node_modules/`, `docs/`). Detalhes, cache e
redirects em `references/05-deploy-cloudflare.md`.

Aceite: URL `*.pages.dev` em 200, HTTPS, e nenhum 404 nos assets.

---

### Fase 6 — Domínio

```bash
bash scripts/domain-check.sh empresa.com.br empresa.com
```

Decisão:

1. `.com.br` livre → registre (registro.br) e aponte para o Pages.
2. `.com.br` tomado **por outra empresa** → **não** tente parecido enganoso. Vá de `.com`
   (se livre) ou de um sufixo honesto (`empresaal.com.br`, `empresaeng.com.br`).
3. Domínio com mesmo nome, mesmo setor → documente e escolha outro; risco de marca.

Passo a passo de DNS/SSL em `references/06-domain.md`.

---

### Fase 7 — Abordagem de negócio

Ver `references/07-business.md`. O formato que funciona:

1. **Diagnóstico de 1 página** com o que foi encontrado (fato + fonte + print).
2. **Protótipo** já no ar, com o nome da empresa e um aviso `protótipo não oficial`.
3. Mensagem curta no WhatsApp/e-mail: 1 achado, 1 oferta, 1 pergunta.
4. Proposta com escopo fechado e 3 faixas de preço.

Nunca publique um site com a marca do cliente como se fosse oficial sem autorização.
Use `noindex` + faixa de "protótipo" até o aceite.

---

## Checklist final

- [ ] Site atual confirmado como **da mesma empresa** (ou declarado "sem site")
- [ ] Toda afirmação tem fonte no `scan.md`
- [ ] **Zero tell de IA**: sem "não é apenas X, é Y", sem tricolon vazio, sem emoji em CTA
- [ ] Contraste AA e fundo não-branco-puro
- [ ] Imagens com dimensão + lazy fora do hero
- [ ] Links internos: 0 quebrados
- [ ] Cabeçalhos de segurança aplicados (CSP sem `unsafe-inline`, HSTS, nosniff)
- [ ] Formulário com honeypot + validação no servidor
- [ ] `robots.txt` + `sitemap.xml` + JSON-LD + `llms.txt`
- [ ] Domínio verificado por RDAP, com decisão registrada
- [ ] Protótipo com `noindex` e aviso de não oficial

## Referências

- `references/01-scan.md` — varredura de Instagram/web com sessão autenticada
- `references/02-identity.md` — cor, tipo, forma e contraste
- `references/03-copy.md` — copy técnico, tells de IA e lista proibida
- `references/04-build.md` — arquitetura estática e motor do cinematic scroll
- `references/05-deploy-cloudflare.md` — Cloudflare Pages, DNS e cache
- `references/06-domain.md` — RDAP, registro e SSL
- `references/07-business.md` — diagnóstico, oferta, preço e abordagem
- `references/08-security.md` — CSP, cabeçalhos, formulário e DNS seguro
- `references/09-ai-legibility.md` — `llms.txt`, semântica e leitura por agentes
