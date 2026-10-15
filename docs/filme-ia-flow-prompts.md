# Prompts para o Google Flow — filme "Cinematic Scroll" da HardSol

Este documento gera o **filme real** que substitui os frames sintéticos de teste
em `frames/desktop` e `frames/mobile`. Ele segue exatamente o método adotado no
projeto: 6 cenas contínuas, câmera sempre avançando, paleta fixa e cada cena
**começando onde a anterior terminou**.

> Só os **frames** importam: o site desenha imagem por imagem no scroll, sem tocar
> vídeo. Por isso **não pode haver texto, logo, legenda, marca d'água nem fala** —
> as legendas são HTML, sobrepostas pelo site.

---

## 1. Como usar no Flow (workflow)

1. **Projeto novo** no Flow, formato **16:9** (paisagem). Nunca vertical.
2. Gere primeiro **6 stills** (um por cena) com o prompt de `STILL` de cada cena —
   eles definem o primeiro frame e travam o estilo.
3. Modele cada clipe com **"Frames to Video"** (imagem → vídeo):
   - Cena 1: use o still da cena 1 como **first frame**.
   - Cena N>1: extraia o **último frame** da cena N−1 e use como **first frame** da cena N.
     Isso garante a emenda invisível que o scroll exige.
4. Gere **2–3 variações por cena** e escolha a que melhor "casa" o primeiro frame
   com o último frame da cena anterior.
5. Duração: **8s por clipe** (limite do Veo 3). 6 cenas → ~48s. Se precisar de mais
   respiro, use **Extend** mantendo o mesmo prompt de estilo.
6. Junte e codifique com o pipeline do projeto:
   ```bash
   cp scene1.mp4 scene2.mp4 … tools/clips/
   bash tools/encode-real-film.sh        # junta, extrai frames e gera WebP
   # ajuste data-frame-count no index.html com o total de frames
   ```
   > Com 48s, extraia a **12 fps** (~576 frames) para não pesar a página. O script
   > aceita `FPS=12` (padrão 24).

**Regra de ouro da consistência:** o **bloco STYLE é copiado e colado, idêntico,
em todos os prompts**. É ele que faz 6 clipes parecerem uma tomada só.

---

## 2. Bloco STYLE — fixo (cole igual em todas as cenas)

```
STYLE (identical in every shot):
Cinematic photoreal film, shot on a 35mm anamorphic lens, shallow depth of field,
fine natural film grain, high dynamic range, polished reflective surfaces
(glass, brushed metal, wet concrete).
Look: premium clean-energy commercial, calm, optimistic, deliberate pacing.
Lighting: warm low-angle golden sunlight as the only light source, deep teal-navy
shadows, soft volumetric god-rays, subtle atmospheric haze, gentle lens flare.
Colour palette: solar amber / honey gold light (#F7A823 amber, #FFC24D bright gold,
#D9791A deep amber) against deep desaturated teal-navy darkness (#070B12 near-black,
#14B8A6 teal accent, #0D7D72 deep teal).
Camera: one continuous slow FORWARD dolly, eye-level, always moving forward,
never cutting, no pans, no zooms, no handheld shake.
Mood: quiet awe, hope, efficiency, sustainability.
No text, no numbers, no logos, no watermarks, no on-screen captions, no people
speaking, no dialogue.
16:9, cinematic.
```

> Se as cores mudarem depois, **edite só este bloco** (e o CSS). Nada mais precisa
> mudar nos prompts.

---

## 3. Regras de continuidade (para o scroll parecer uma tomada só)

- Cada cena **começa exatamente onde a anterior terminou** — mesma linha de
  horizonte, mesma direção da luz (vinda da direita), mesmo ambiente teal-navy.
- A câmera **nunca muda de direção**: sempre avançando. Trocar de direção quebra a
  ilusão de continuidade.
- **Sem cortes, fades ou transições** dentro do clipe.
- Mantenha o sol/fonte de luz na **mesma posição relativa** entre as cenas.
- Nada de texto, número, marca ou rosto falando.

---

## 4. Prompts por cena

### Cena 1 — Amanhecer sobre o campo de painéis

**STILL (primeiro frame):**
```
[STYLE] Wide cinematic shot at first light: a vast field of dark monocrystalline
solar panels stretching to the horizon, perfectly aligned in rows, wet with mist.
A low warm amber sun just crests the far edge of the panel field on the right,
throwing long golden light across the glass rows toward the camera. Deep teal-navy
sky with the last stars fading. Empty, silent, hopeful.
```

**SHOT:**
```
[STYLE]
SHOT: The sun rises slowly behind a vast field of dark solar panels.
ENVIRONMENT: Amazonian lowland landscape, thin morning mist, silhouetted treeline
far behind the panels, black volcanic soil between rows.
CAMERA: extremely slow forward dolly, eye-level, centered, dead-straight.
LIGHTING & COLOUR: pre-dawn deep teal-navy that warms to amber as the sun climbs;
long shadows stretching toward camera; mist glowing where the light hits.
CONTINUITY: this is the opening shot — establish the horizon line at the middle of
frame and the sun on the right.
DURATION/PACING: 8 seconds, very slow.
AUDIO: soft ambient wind and distant birds, no music, no dialogue.
```
**Último frame (para a cena 2):** câmera já baixa sobre a primeira fileira de painéis, luz dourada varrendo a superfície de vidro.

---

### Cena 2 — A luz entra nos painéis (absorção)

**SHOT:**
```
[STYLE]
SHOT: Continuing forward from the previous shot, the camera skims low and slow just
above the surface of the solar panel rows. Golden sunlight sweeps across the
photovoltaic cells; reflections ripple along the glass; thin glowing lines of
light begin to travel along the panel edges, as if the panels are drinking the sun.
ENVIRONMENT: same solar field, now passing between the rows; dust motes floating in
the light beams.
CAMERA: same slow forward dolly, eye-level, low to the panels, never changing direction.
LIGHTING & COLOUR: warm amber light raking across glass, teal-navy shadows beneath
the rows, strong specular highlights.
CONTINUITY: start from the last frame of scene 1 (camera low over the first row,
sun on the right); keep the horizon in the same place.
DURATION/PACING: 8 seconds, slow and smooth.
AUDIO: gentle hum of energy building, ambient, no dialogue.
```
**Último frame:** as linhas de luz convergem para um cabo que sai do painel à direita.

---

### Cena 3 — A energia chega à casa/empresa (OnGrid)

**SHOT:**
```
[STYLE]
SHOT: Continuing forward from the previous shot, the camera follows the glowing lines
of energy as they flow out of the panels, along a black cable, and into a modern
minimal house. Interior lights switch on one by one through the windows, warm amber
glow spreading from room to room; on the wall, an electricity meter's dial visibly
spins backwards. The panels on the roof are the same as the field.
ENVIRONMENT: contemporary tropical-modern architecture, glass walls, concrete and
timber, tropical plants, wet paving reflecting the sky.
CAMERA: same slow forward dolly, eye-level, entering through an open glass door.
LIGHTING & COLOUR: exterior golden hour, interior warm amber pools of light against
teal-navy shade; the cable glows faintly amber.
CONTINUITY: start from the last frame of scene 2 (the glowing cable leaving the panel
on the right); same horizon and light direction.
DURATION/PACING: 8 seconds, slow and smooth.
AUDIO: soft click of switches, quiet room tone, no dialogue.
```
**Último frame:** a câmera atravessa uma porta e chega a uma garagem limpa.

---

### Cena 4 — Mobilidade elétrica (garagem solar)

**SHOT:**
```
[STYLE]
SHOT: Continuing forward from the previous shot, the camera glides into a clean
concrete garage where a modern electric car is parked. A solar charging station on
the wall glows with a soft amber ring; a pulse of light travels down the charging
cable into the car; the car's charge indicator lights rise smoothly. Solar panels
are visible through the open garage door behind.
ENVIRONMENT: minimal concrete garage, brushed metal details, tidy cables, one plant.
CAMERA: same slow forward dolly, eye-level, approaching the car front-three-quarter.
LIGHTING & COLOUR: dim teal-navy interior lit by the amber glowing charger ring and
the daylight spilling through the door; polished floor reflections.
CONTINUITY: start from the last frame of scene 3 (camera crossing the doorway into
the garage); keep the light coming from the right.
DURATION/PACING: 8 seconds, slow and smooth.
AUDIO: soft electrical hum, no dialogue, no music.
```
**Último frame:** a câmera passa pela garagem e sai para o campo aberto ao fundo.

---

### Cena 5 — Água e campo (bombeamento e aquecimento solar)

**SHOT:**
```
[STYLE]
SHOT: Continuing forward from the previous shot, the camera emerges into open
farmland where a solar water pump pushes clear water along an irrigation channel,
the water glinting in golden light. On a nearby rooftop, evacuated-tube solar
thermal collectors focus the sun; faint warm steam rises from a water tank. A small
off-grid battery bank stands beside the pump, quietly glowing.
ENVIRONMENT: tropical farmland, irrigation channel, red earth, green crops,
the solar field visible far behind.
CAMERA: same slow forward dolly, eye-level, drifting past the pump toward the tanks.
LIGHTING & COLOUR: strong warm amber sun low on the right, water highlights, deep
teal-navy shadows, atmospheric haze.
CONTINUITY: start from the last frame of scene 4 (camera exiting the garage into the
open); same horizon height and light direction.
DURATION/PACING: 8 seconds, slow and smooth.
AUDIO: running water, gentle wind, no dialogue.
```
**Último frame:** câmera sobe levemente e revela os telhados da cidade ao longe.

---

### Cena 6 — Finale (cidade abastecida pelo sol)

**SHOT:**
```
[STYLE]
SHOT: Continuing forward from the previous shot, the camera rises gently and drifts
over a green tropical city at golden hour, rooftops covered with rows of solar
panels glowing amber as they catch the last light; thin cables of light connect the
rooftops like veins. The camera slows and settles, holding the view.
ENVIRONMENT: modern sustainable city in the Amazon, trees between buildings, a river
catching the sun, hazy warm horizon.
CAMERA: same forward dolly, gently rising to a wide elevated view, then decelerating
to a near stop — still no cuts.
LIGHTING & COLOUR: golden hour, amber rim light on every panel, deep teal-navy in
the shadows and sky, warm haze.
CONTINUITY: start from the last frame of scene 5 (rising over rooftops); keep the sun
on the right and the horizon where it was.
DURATION/PACING: 8 seconds, slow, resolving.
AUDIO: wide ambient, soft and hopeful, no dialogue.
```
**Último frame:** amplo, calmo — é o frame final do filme (a cena "Reduza até 95%").

---

## 5. Prompt negativo (cole no campo de negative prompt, se houver)

```
text, letters, numbers, captions, subtitles, logos, brand marks, watermarks,
UI overlays, speech, dialogue, subtitles, people talking, extra limbs, deformed
hands, vertical framing, portrait aspect, jump cuts, hard cuts, fade to black,
whip pan, handheld shake, changing camera direction, day-for-night, oversaturated
neon, purple/magenta grading, plastic CGI look, cartoon, anime, low resolution,
blurry, compression artifacts, duplicate panels, warped geometry, floating objects
```

---

## 6. Checklist antes de codificar

- [ ] 16:9 em todos os clipes, **sem texto/logo** em nenhum frame.
- [ ] Primeiro frame de cada cena = último frame da anterior (sem salto visível).
- [ ] Câmera avançou na mesma direção em todas as cenas.
- [ ] Paleta âmbar + teal-navy consistente (STYLE idêntico em todo prompt).
- [ ] 6 clipes em `tools/clips/scene1.mp4 … scene6.mp4`.
- [ ] `FPS=12 bash tools/encode-real-film.sh` → frames em `frames/desktop` e `frames/mobile`.
- [ ] `data-frame-count` no `index.html` = total de frames gerado.

---

## 7. Observações para a próxima rodada (mudanças que você vai pedir)

- **Cores:** a paleta vive em dois lugares — o bloco STYLE aqui e as variáveis
  `--solar*` / `--ink*` / `--teal*` em `assets/css/style.css`. Mudar uma implica
  regenerar o filme (ou re-gradear os frames via ffmpeg sem regerar).
- **Fontes, remoção de itens e área de blog:** mudanças de HTML/CSS, não afetam o filme.
- **Preparo para agentes/IA:** `llms.txt`, dados estruturados (JSON-LD) mais ricos,
  HTML semântico e endpoints machine-readable — encaixam como uma camada adicional
  sem tocar no motor do filme.
