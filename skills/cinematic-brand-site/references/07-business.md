# 07 · Abordagem de negócio

## A regra que evita queimar a marca

Você está criando valor para uma empresa **consolidada**. Ela já tem clientes, Instagram e
reputação. O que ela não tem é presença própria bem feita. Então:

- **não** critique o trabalho de ninguém em público
- **não** publique um site com a marca do cliente como se fosse oficial
- **não** invente números para "impressionar"

## Diagnóstico de 1 página

Monte com fatos e fontes. Formato:

```md
# Diagnóstico — <Empresa> · <data>
## O que existe hoje
- Instagram: @x · N seguidores · N posts · bio: "…"
- Site: nenhum | <url> (auditado em <data>)
- Domínio: <domínio> (livre | registrado por terceiro)

## A lacuna
1. Sem site → o Instagram é o site: bio com 150 caracteres, sem SEO, sem conversão.
2. Sem domínio próprio → link da bio aponta para WhatsApp, não para a marca.
3. Sem página de obra → prova social presa no feed, não indexável.

## O que resolve
- uma página com o portfólio, o processo e o contato em 1 clique
- domínio próprio com HTTPS
- JSON-LD + sitemap para aparecer na busca local

## Oferta
Protótipo no ar em 5 dias úteis. Aprovação → publicação no domínio próprio.
```

## Leitura da lacuna (o gancho)

| Situação | Gancho honesto |
|---|---|
| Sem site | "quem procura 'construtora em Maceió' não encontra vocês" |
| Template/placeholder | "o site de vocês está com o template padrão do Bootstrap" — **só se for o site deles** |
| Site sem mobile | mostrar no celular, ao vivo |
| Feed forte, site fraco | "o feed vende; o site não vende" |

> Se o domínio com o nome é de **outra empresa**, o gancho é: "o `.com.br` do nome já é de
> outra empresa — o `.com` está livre e é seu".

## Mensagem (WhatsApp / e-mail)

Curta. 3 blocos: achado, oferta, pergunta.

```
Oi, <nome>. Achei vocês pelo Instagram (@<perfil>) — o trabalho de <especialidade> aparece bem no feed.

Notei que <achado factual: não há site / o site não abre no celular / o link da bio vai direto pro WhatsApp>.

Montei uma página de teste com o portfólio de vocês e o contato em um clique: <url>.
É um protótipo, ainda não oficial.

Se fizer sentido, eu publico no domínio próprio em <prazo>. Posso te mostrar em 10 minutos?
```

Regras: 1 mensagem, sem áudio não pedido, sem "proposta anexa" de 12 páginas, e sempre
oferecer a saída ("se não fizer sentido, sem problema").

## Faixas de preço (Brasil, 2026)

Use como referência, ajuste à região e ao escopo:

| Pacote | Escopo | Faixa |
|---|---|---|
| Essencial | 1 página (hero + serviços + contato), domínio e deploy | R$ 1.500 – 2.500 |
| Profissional | 5–8 páginas + blog + SEO técnico + formulário/webhook | R$ 3.500 – 6.000 |
| Cinematic | filme/frames + animação de scroll + 8 páginas + blog | R$ 7.000 – 12.000 |
| Mensal | hospedagem, monitoramento, 2 posts/mês, relatório | R$ 250 – 600/mês |

Cobrança: 40% na aprovação, 40% no protótipo, 20% na publicação. Domínio e hospedagem
repassados ou incluídos explicitamente.

## Política de protótipo (protege os dois lados)

- hospede em `<slug>-preview.pages.dev`
- `<meta name="robots" content="noindex, nofollow">`
- faixa fixa no topo: **"Protótipo não oficial — feito para <empresa>"**
- sem formulário apontando para o WhatsApp do cliente até o aceite
- prazo de retirada: 15 dias sem resposta → derruba com redirect para uma página neutra

## Fechamento

- o domínio deve ficar no nome do cliente
- entregue acesso ao repositório e ao Cloudflare no aceite final
- contrato simples: escopo, prazo, revisões (2), o que não está incluído
