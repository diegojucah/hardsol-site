# 02 · Identidade (cor, tipo, forma)

## Extrair paleta dos próprios ativos

```bash
bash scripts/palette.sh ./scan/*.jpg
```

O script reduz cada imagem a 1 pixel e devolve a média RGB. Para uma paleta de verdade,
rode com `-vf scale=8:8` e agrupe; o objetivo é achar **a cor de marca**, não a média do feed.

Regra prática:
- a cor mais saturada e repetida nas capas = **primária**
- a cor do logo (fundo/contorno) = **secundária**
- cinzas do feed = **neutros**

## Tokens mínimos

```css
:root {
  --primary: #...;      /* marca */
  --primary-600: #...;  /* hover (mais escuro) */
  --secondary: #...;
  --bg: #FAFAFA;        /* nunca #FFFFFF puro em site "premium" */
  --surface: #FFFFFF;   /* cards */
  --ink: #...;          /* texto principal */
  --muted: #...;        /* apoio */
  --line: #E5E5EE;
  --e1: 0 1px 2px rgb(0 0 0 / .04), 0 6px 16px -10px rgb(0 0 0 / .14);
  --e2: 0 2px 4px rgb(0 0 0 / .04), 0 16px 32px -18px rgb(0 0 0 / .2);
  --lift: -3px; --dur: .4s;
}
```

## Contraste (obrigatório AA)

- texto normal ≥ **4.5:1**; texto grande (≥ 24px) ≥ **3:1**
- se a cor da marca reprova, **não** troque a marca: use `--ink` no texto e a cor só em
  acento, borda e ícone.
- verifique com: `npx pa11y` ou o contrast checker do DevTools.

## Tipografia

- 1 família, 2–3 pesos. Geométrica (Poppins, Jost) para tech/construção; humanista para
  serviços.
- títulos `clamp(2.2rem, 1.5rem + 3vw, 4rem)`, `line-height ≈ 1.1`, `letter-spacing -0.02em`
- corpo `1rem–1.0625rem`, `line-height 1.65`

## Forma

- raio 14–18 px em cards; pílula (`999px`) em botões
- sombra **só no hover**; em repouso, borda de 1px
- hover: `translateY(var(--lift))` + `box-shadow: var(--e2)` + `var(--dur)`
- nada de gradiente decorativo em card; gradiente só em faixa de CTA ou fundo de hero

## Saída

`brand.json` preenchido + `assets/css/tokens.css` + uma nota de contraste medida
(`texto #xxx sobre fundo #yyy = 7.1:1`).
