# scan.md — L2 Construtora

Coleta em 29/10/2026. **Toda linha tem fonte.** O que não foi possível obter está em
"Pendências de coleta" — nada foi preenchido por suposição.

## 1. Cadastro (Receita Federal)

| Campo | Valor | Fonte |
|---|---|---|
| Razão social | L2 CONSTRUTORA LTDA | BrasilAPI / CNPJ 43.783.180/0001-38 |
| Nome fantasia | L2 CONSTRUTORA | idem |
| CNPJ | **43.783.180/0001-38** | idem |
| Situação | **ATIVA** | idem |
| Início de atividade | **06/10/2021** | idem |
| CNAE principal | **41.20-4-00 — Construção de edifícios** | idem |
| Porte | Micro Empresa | idem |
| Natureza | Sociedade Empresária Limitada | idem |
| Telefone | **(82) 3522-2755** | Receita Federal; confirmado em diretório LojasDeConstrucao |
| Endereço | **Rua Nossa Senhora de Fátima, 305 — Alto do Cruzeiro — Arapiraca/AL — CEP 57312-461** | Receita Federal |
| Sócia-administradora | **Amanda Silva Araujo Barboza** | QSA / Receita Federal |

> **Correção importante:** a empresa foi aberta em **2021**, não em 2014. O espécime anterior
> trazia "desde 2014" — erro corrigido.

## 2. Instagram — @l2construtora

| Campo | Valor |
|---|---|
| Nome | L2 Construtora |
| Seguidores / posts | 3.083 · 219 |
| Bio (literal) | "👉 "🏗️ Construtora em Alagoas / ✨ Obras, reformas e planejamento personalizados / 📍 Qualidade + compromisso em cada projeto / 📲 Fale conosco no WhatsApp ⬇️" |
| Link da bio | não exposto sem sessão |
| Cor do logo | **verde `#00A74F`** (pixel dominante do avatar) |

## 3. Instagram — @pascoalneto

| Campo | Valor |
|---|---|
| Nome | Pascoal Neto |
| Bio (literal) | "Engenheiro Civil / Sócio- Diretor da @l2construtora" |
| Seguidores / posts | 4.396 · 163 |

## 4. Obras citadas pelo próprio perfil

| Obra | Dado concreto | Fonte |
|---|---|---|
| Casa no **Condomínio Perucaba** | casa executada; "cada detalhe" | legenda |
| **Barragem — Itograss** | represamento **> 500 mil m³** | legenda |
| **Mercadão Festa** | reforma em 2019 + **expansão > 400 m²** | legenda |
| **Hotel Nexos Maceió** | execução com método **Light Wall**; 26 mil seguidores no perfil do hotel | legenda + @nexoshotelmaceio |
| Residência de alto padrão | à venda; projeto de **@arquitetarosycunha** | legenda |

Clientes/parceiros citados: @itograss_, @nexoshotelmaceio, @mercadaofesta, @arquitetarosycunha.

## 5. Outros canais públicos

| Canal | Situação |
|---|---|
| Facebook | página `L2-construtora` e `l2construtora` (Recife) existem; conteúdo não acessível sem login |
| Site próprio | **nenhum encontrado** |
| Diretório | LojasDeConstrucao lista telefone e endereço (coincide com a Receita) |

## 5b. Stories e destaques (varredura autenticada)

| Item | Valor |
|---|---|
| WhatsApp | **(82) 98223-0101** — `+5582982230101`, do link da bio (`whats.link/l2construtoraa`) |
| Destaques | **14**: Feicon/25, Sierra P-01, SOS Bem Estar, Casa JB, B21, Altavista, Feicon/24, Riviera F-26, Altaville, Arquipélogo, Em andamento, Obras entregues, Reformas, Contatos |
| Projetos nomeados | Altavista · Altaville · Sierra P-01 · Riviera F-26 · B21 · Casa JB · Arquipélogo · SOS Bem Estar |
| Feira | **FEICON 2024 e 2025** (destaques próprios) |
| Conteúdo dos stories | 58 capturas em `l2/assets/stories/` (não versionado) |
| Limite encontrado | destaques de ~2020 (“Obras entregues”, “Reformas”, “B21”) têm mídia expirada no próprio Instagram |

## 6. Pendências de coleta (não inventar)

| Item | Por que falta | Como resolver |
|---|---|---|

| **E-mail** | não publicado em nenhuma fonte | cliente |
| **Fotos das obras** | o feed não entrega imagens ao crawler; sem sessão, sem mídia | sessão autenticada ou arquivos do cliente |
| Nome do sócio Pascoal no QSA | o QSA público traz só a administradora | confirmar com o cliente |

## 7. Alerta de segurança da coleta

A página `lojasdeconstrucao.com` continha um endereço de e-mail
`claudebot@anthropic.com` embutido no texto. Não é dado da empresa: tem cara de **injeção
de conteúdo** (tentativa de induzir o agente). Foi **descartado** e não entra em nenhum
arquivo do site.
