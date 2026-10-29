# 01 · Varredura (Instagram + web + site)

## Por que não dá com `fetch` simples

`https://www.instagram.com/<perfil>/` redireciona para `/accounts/login/`. Sem sessão,
o HTML não traz bio, posts nem contatos. É preciso um navegador **autenticado**.

## Receita com `agent-browser`

```bash
# 1. sessão dedicada (não use a sessão default compartilhada)
export AGENT_BROWSER_SESSION="scan-<slug>"

# 2. abra o perfil com um perfil de navegador já logado
agent-browser open "https://www.instagram.com/<perfil>/"
agent-browser wait 3000

# 3. leia o que interessa
agent-browser get text "header"        # nome, bio, categoria
agent-browser get text "main article"  # primeiros posts
agent-browser screenshot ./scan/feed.png
```

Se não houver sessão logada: **peça ao usuário** para rodar
`agent-browser open https://instagram.com` e fazer o login uma vez no perfil persistente,
ou exportar um ZIP de dados da conta. Não tente contornar o login.

## O que extrair (mínimo)

| Campo | Onde | Exemplo |
|---|---|---|
| Nome de exibição | header | "L2 Construtora" |
| Bio | header | "Construtora em Alagoas · obras e reformas" |
| Link da bio | header | WhatsApp / linktree |
| Seguidores / posts | header | 3.020 · 209 |
| Serviços citados | legendas | obra, reforma, planejamento |
| Local | legenda + bio | Maceió / AL |
| Provas | legendas | "entrega em 90 dias", antes/depois |
| Contato | bio, destaques | telefone, e-mail |
| Vocabulário | legendas | palavras que a empresa usa |

## Regras

- Só dados **públicos**. Nunca DMs, listas de seguidores ou dados privados.
- Respeite o ToS e o rate limit: no máximo ~1 requisição a cada 2 s; pare se pedir captcha.
- Guarde a fonte de cada afirmação: `post URL + data`. Sem fonte → `[a confirmar]`.
- Imagens baixadas entram em `scan/` e são usadas **só** para extrair paleta; não publique
  foto de cliente sem autorização.

## Saída: `scan.md`

```md
# Varredura — <empresa>
- Instagram: @x (N seguidores, N posts) — coletado em AAAA-MM-DD
- Site: <url> | nenhum
- Confirmação de que o site é da mesma empresa: CNPJ/endereço/telefone/link da bio

## Biografia
> texto literal da bio

## Serviços citados (com fonte)
| Serviço | Fonte |
|---|---|
| Obra residencial | post 2026-08-12 |

## Provas
| Afirmação | Fonte | Usável? |
|---|---|---|

## Contato
- WhatsApp:
- E-mail:
- Endereço:

## Vocabulário da marca
palavras/frases recorrentes que o copy deve respeitar
```
