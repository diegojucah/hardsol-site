# 09 · Visibilidade para agentes de IA

Um site é "bem visto por IA" quando um agente consegue **entender, citar e navegar** sem
adivinhar. Isso é diferente de SEO tradicional: aqui o leitor é um modelo.

## Camadas

| Camada | Arquivo | Função |
|---|---|---|
| Resumo | `llms.txt` | o que a empresa faz, serviços, contatos, links (curado à mão) |
| Texto integral | `llms-full.txt` | todas as páginas em Markdown, numa requisição |
| Permissão | `robots.txt` | liberar GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot |
| Estrutura | `sitemap.xml` | URLs estáveis + `lastmod` |
| Dados | JSON-LD | `Organization`, `LocalBusiness`, `Service`, `Article`, `BreadcrumbList` |
| Semântica | HTML | `main`, `article`, `aside`, `time[datetime]`, um `h1` |
| Identidade | `sameAs` | Instagram, LinkedIn, Google Business no `Organization` |

## Regras de conteúdo

- **texto é texto**: nada de informação só dentro de imagem (o agente não lê o JPG)
- nada de conteúdo essencial atrás de clique, modal ou JS que depende de interação
- datas em `<time datetime="AAAA-MM-DD">`
- uma afirmação por parágrafo, com o número junto (não "diversos projetos")
- links com âncora descritiva ("portfólio de obras", não "clique aqui")
- URL sem `?id=`; um assunto por página; redirect 301 quando mudar

## `llms.txt` mínimo

```md
# Empresa

> Uma frase com o que a empresa faz, onde e para quem.

## Serviços
- [Nome](/servicos/x.html): uma linha objetiva.

## Obras
- [Obra](/trabalhos.html): metragem, ano, local.

## Contato
- WhatsApp: ...
- E-mail: ...
```

## O que derruba a leitura por IA

- `noindex` esquecido no deploy de produção
- conteúdo duplicado entre páginas
- página que só funciona com JavaScript pesado
- imagens sem `alt` (e sem texto equivalente)
- dados de contato apenas como imagem (o clássico rodapé em PNG)
- `robots.txt` bloqueando os agentes por engano

## Verificação

```bash
curl -s https://dominio/llms.txt | head
curl -s https://dominio/robots.txt
curl -s https://dominio/sitemap.xml | head
# rich results: https://search.google.com/test/rich-results
```
