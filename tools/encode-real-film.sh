#!/usr/bin/env bash
# Pipeline para o FILME REAL gerado por IA (3-6 cenas) — método Cinematic Scroll.
#
# Uso:
#   1) Coloque os clipes na ordem em tools/clips/ (scene1.mp4, scene2.mp4, ...)
#   2) FPS=12 bash tools/encode-real-film.sh   (padrão 12 fps; ~200-500 frames)
#
# Este script junta os clipes, extrai frames e delega a codificação WebP.
set -eu
cd "$(dirname "$0")/.."

FF="$(node -e "process.stdout.write(require('./tools/node_modules/ffmpeg-static'))")"
CLIPS_DIR="tools/clips"
LIST="$CLIPS_DIR/list.txt"
COMBINED="$CLIPS_DIR/combined.mp4"
OUT="/tmp/film_png"
FPS="${FPS:-12}"

if [ ! -d "$CLIPS_DIR" ]; then
  echo "Crie $CLIPS_DIR e coloque os clipes (scene1.mp4, scene2.mp4, ...)." >&2
  exit 1
fi

# Gera a lista de concatenação na ordem numérica dos clipes.
: > "$LIST"
for f in "$CLIPS_DIR"/scene*.mp4; do
  [ -e "$f" ] || continue
  echo "file '$(basename "$f")'" >> "$LIST"
done
if [ ! -s "$LIST" ]; then
  echo "Nenhum clipe scene*.mp4 encontrado em $CLIPS_DIR." >&2
  exit 1
fi

echo "== juntando clipes =="
"$FF" -hide_banner -loglevel error -y -f concat -safe 0 -i "$LIST" -c copy "$COMBINED"

echo "== extraindo frames (alvo FPS=$FPS) =="
rm -rf "$OUT" && mkdir -p "$OUT"
"$FF" -hide_banner -loglevel error -y -i "$COMBINED" -vf "fps=$FPS" "$OUT/frame_%04d.png"
FRAMES=$(find "$OUT" -name '*.png' | wc -l)
echo "   $FRAMES frames extraídos"

echo "== codificando WebP =="
bash tools/encode-frames.sh "$OUT"
echo "Pronto. Defina data-frame-count=\"$FRAMES\" no index.html."
