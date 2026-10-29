# Plano — Pacote de skill "Cinematic Brand Site"

## Objetivo

Transformar a entrega que fizemos na HardSol em um **produto replicável**: um pacote de
skill que, a partir do Instagram de uma empresa consolidada, (1) interpreta a mensagem,
(2) extrai a identidade, (3) escreve copy técnico, (4) constrói e publica o site
cinematic-scroll, (5) resolve domínio e Cloudflare e (6) estrutura a abordagem comercial.

## O que já foi verificado (L2 Construtora)

| Item | Achado | Fonte |
|---|---|---|
| Instagram | **@l2construtora** · 3.020 seguidores · 209 posts · "Construtora em Alagoas · obras, reformas e planejamento" | perfil público (snippet de busca) |
| Segundo perfil | @l2construtorarecife · "execução de obras, coordenação de projetos e gestão de obras" | perfil público |
| Varredura direta do Instagram | **bloqueada** — `instagram.com/l2construtora` redireciona para `/accounts/login` | verificado |
| `l2construtora.com.br` | **registrado por outra empresa** (`ADRIANE MOREIRA RIBEIRO - ME`), ativo até 2027 | RDAP registro.br |
| `l2construcoes.com.br` | registrado até 2027 | RDAP |
| `l2construtora.eng.br` | registrado, expira em 2026-11-03 | RDAP |
| **`l2construtora.com`** | **LIVRE** | RDAP Verisign |
| `l2construtora.net` · `.arq.br` · `.co` · `l2construtoraal.com.br` · `l2construtoraoficial.com.br` | livres | RDAP |

> **Correção importante:** o site em `l2construtora.com.br` é o template padrão do Bootstrap,
> mas pertence a **outra empresa de mesmo nome**. Ele **não** entra no diagnóstico da L2 e
> **não** pode ser usado como gancho comercial.

## Recomendação de domínio

1. **Principal:** `l2construtora.com` (livre, nome exato, sem ambiguidade com terceiros).
2. **Secundário:** `l2construtoraal.com.br` (livre) — reforça a praça Alagoas.
3. **Não** registrar `l2construtora.com.br` (de terceiro) nem variações que imitem o nome
   de outra empresa.

---

## O pacote de skill

Criado em `skills/cinematic-brand-site/` (versionado). Estrutura:

```
skills/cinematic-brand-site/
├── SKILL.md                      # manifesto + as 7 fases (o agente carrega isso)
├── install.sh                    # instala em ~/.commandcode/skills
├── assets/brand.template.json    # schema de brand.json (cores, contatos, tom, fontes)
├── references/
│   ├── 01-scan.md                # varredura de Instagram/web com sessão autenticada
│   ├── 02-identity.md            # paleta, tipografia, contraste AA
│   ├── 03-copy.md                # copy técnico + lista de palavras proibidas
│   ├── 04-build.md               # arquitetura estática + motor do cinematic scroll
│   ├── 05-deploy-cloudflare.md   # Pages, cache, redirects, CI
│   ├── 06-domain.md              # RDAP, DNS, SSL e o risco de mexer no MX
│   └── 07-business.md            # diagnóstico, mensagem, faixas de preço, protótipo
└── scripts/
    ├── domain-check.sh           # disponibilidade via RDAP (.br e .com)
    ├── site-audit.sh             # auditoria do site atual do prospect
    └── palette.sh                # cor média de imagens via ffmpeg
```

**Instalação** (um comando):

```bash
bash skills/cinematic-brand-site/install.sh            # escopo do usuário
bash skills/cinematic-brand-site/install.sh --project  # escopo do projeto
```

Depois: `cmd skills list` (ou `/skills` no TUI) e invoque com `/cinematic-brand-site`.

---

## As 7 fases aplicadas à L2

### Fase 0 — Descoberta
1. Confirmar que o Instagram é a **mesma** L2 que o prospect (endereço, CNPJ, telefone).
2. Rodar `site-audit.sh` no site atual — se existir **e for deles**.
3. Escolher a lacuna. Para a L2: **sem site próprio** (o Instagram é o site) + **domínio
   exato indisponível no .com.br**.

### Fase 1 — Varredura
1. Abrir o Instagram com sessão autenticada (`agent-browser`), coletar bio, link,
   destaques e 9–12 posts.
2. Registrar serviços, obras, praças, provas e vocabulário.
3. Montar `scan.md` com coluna **fonte** em cada linha.

### Fase 2 — Identidade
1. Baixar 6–10 imagens do feed para `scan/`.
2. `palette.sh` para a cor média; agrupar para achar a cor de marca.
3. Preencher `brand.json` (cores, fontes, contatos, tom).
4. Medir contraste — se reprovar, ajustar o texto, não a marca.

### Fase 3 — Copy
1. Definir as seções pelo que a empresa **faz** (obra, reforma, planejamento).
2. Escrever com número e faixa; sem palavra da lista proibida.
3. Marcar `[a confirmar]` onde não houver fonte.

### Fase 4 — Build
1. Gerar a estrutura estática e o `brand.json` → CSS tokens.
2. Hero com cinematic scroll (frames do vídeo da obra, se houver) ou imagem única + feixe.
3. CLS: dimensão em toda imagem; lazy fora da dobra.
4. JSON-LD `Organization` + `LocalBusiness` + `Service`.
5. Auditoria de densidade (60–400 palavras/imagem) e links.

### Fase 5 — Deploy
1. `wrangler pages project create l2-construtora`.
2. Deploy só do site (sem `tools/`, `node_modules/`, `docs/`).
3. `_headers` de cache longo para `assets/` e `frames/`.
4. Validar 200 em todas as rotas + HTTPS.

### Fase 6 — Domínio
1. Registrar **`l2construtora.com`** no nome do cliente (ou com cláusula de transferência).
2. DNS na Cloudflare: `www` e apex → `<slug>.pages.dev`.
3. Se houver e-mail no domínio, recriar MX/SPF/DKIM/DMARC **antes** de trocar nameservers.
4. SSL automático + *Always Use HTTPS*.

### Fase 7 — Negócio
1. **Diagnóstico de 1 página** (fatos + fontes + print do perfil).
2. **Protótipo** em `l2-preview.pages.dev`, com `noindex` e faixa "protótipo não oficial".
3. Mensagem única (achado → oferta → pergunta), sem anexo pesado.
4. Proposta com 3 faixas: Essencial / Profissional / Cinematic.
5. Fechamento: domínio no nome do cliente, acesso ao repo e ao Cloudflare.

---

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Instagram exige login | sessão autenticada via `agent-browser`; nunca burlar o login |
| Domínio de terceiro com o mesmo nome | usar `.com` livre; registrar a decisão por escrito |
| Confundir o site de terceiro com o do cliente | validação por CNPJ/telefone/endereço/link da bio antes de qualquer afirmação |
| Publicar com a marca sem autorização | protótipo com `noindex` + faixa de não oficial + prazo de retirada |
| Migrar DNS e derrubar e-mail | recriar MX/SPF/DKIM/DMARC antes da troca |
| Copy com dado inventado | toda linha do copy precisa de fonte no `scan.md` |

## O que falta para rodar na L2

1. **Confirmar** que o Instagram `@l2construtora` é o prospect certo (nome, telefone, cidade).
2. **Sessão autenticada** do Instagram para a varredura (login manual uma vez).
3. **Material de obra**: fotos ou vídeo curto (para o cinematic scroll usar imagem real).
4. **Contatos oficiais** (WhatsApp, e-mail, endereço) para o `brand.json`.
5. **Decisão de domínio**: `l2construtora.com` (recomendado) ou `l2construtoraal.com.br`.

## Próximo passo

Rodar a Fase 0 e a Fase 1 na L2 e devolver: `scan.md` + `brand.json` + diagnóstico de 1
página. Com isso aprovado, a Fase 4 gera o protótipo.
