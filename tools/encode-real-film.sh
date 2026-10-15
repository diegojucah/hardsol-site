#!/usr/bin/env bash
# Pipeline do FILME (método Cinematic Scroll).
#
# Junta os clipes de tools/clips/ (scene1.mp4, scene2.mp4, ...) num único filme,
# extrai os frames e gera os WebP (desktop + mobile).
#
# Opções (variáveis de ambiente):
#   FPS=12        frames por segundo extraídos (padrão 12)
#   LEAD_IN=0     usa apenas os últimos N segundos do PRIMEIRO clipe (abertura curta)
#   XFADE=0       cross-dissolve de N segundos na emenda (evita "salto" entre cenas)
#
# Exemplo (2 clipes, abertura curta + dissolver):
#   LEAD_IN=3 XFADE=1 FPS=12 bash tools/encode-real-film.sh
#
#   Para o filme real gerado por IA, coloque os clipes em tools/clips/ na ordem.
set -eu
cd "$(dirname "$0")/.."
export LC_ALL=C # números com ponto decimal (também vale para o ffmpeg)

FF="$(node -e "process.stdout.write(require('./tools/node_modules/ffmpeg-static'))")"
CLIPS_DIR="tools/clips"
COMBINED="$CLIPS_DIR/combined.mp4"
OUT="/tmp/film_png"
FPS="${FPS:-12}"
LEAD_IN="${LEAD_IN:-0}"
XFADE="${XFADE:-0}"
RATE="${RATE:-24}" # taxa de quadros dos clipes (normalizada no xfade)

if [ ! -x "$FF" ]; then
  echo "ffmpeg-static não encontrado. Rode: cd tools && npm install" >&2
  exit 1
fi

# Clipes em ordem numérica (scene1, scene2, ...).
CLIPS=""
for f in "$CLIPS_DIR"/scene*.mp4; do
  [ -e "$f" ] || continue
  CLIPS="$CLIPS $f"
done
set -- $CLIPS
COUNT=$#
if [ "$COUNT" -eq 0 ]; then
  echo "Nenhum clipe scene*.mp4 em $CLIPS_DIR." >&2
  exit 1
fi

duration() {
  "$FF" -hide_banner -i "$1" 2>&1 | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | head -1 |
    awk -F: '{print ($1*3600)+($2*60)+$3}'
}

echo "== montando o filme ($COUNT clipe(s); LEAD_IN=$LEAD_IN, XFADE=$XFADE) =="
if [ "$XFADE" != "0" ] && [ "$COUNT" -eq 2 ] && [ "$LEAD_IN" != "0" ]; then
  D1="$(duration "$1")"
  START="$(awk -v d="$D1" -v l="$LEAD_IN" 'BEGIN{s=d-l; if(s<0)s=0; printf "%.3f", s}')"
  OFFSET="$(awk -v l="$LEAD_IN" -v x="$XFADE" 'BEGIN{o=l-x; if(o<0)o=0; printf "%.3f", o}')"
  echo "   clipe 1: dos ${START}s até o fim | dissolve de ${XFADE}s no offset ${OFFSET}s"
  # fps= normaliza para taxa constante (exigência do xfade)
  "$FF" -hide_banner -loglevel error -y -i "$1" -i "$2" -filter_complex \
    "[0:v]trim=start=${START},setpts=PTS-STARTPTS,fps=${RATE}[a];[1:v]setpts=PTS-STARTPTS,fps=${RATE}[b];[a][b]xfade=transition=fade:duration=${XFADE}:offset=${OFFSET}[v]" \
    -map "[v]" -an -c:v libx264 -crf 16 -pix_fmt yuv420p "$COMBINED"
else
  : > "$CLIPS_DIR/list.txt"
  for f in "$CLIPS_DIR"/scene*.mp4; do
    [ -e "$f" ] || continue
    echo "file '$(basename "$f")'" >> "$CLIPS_DIR/list.txt"
  done
  ( cd "$CLIPS_DIR" && "$FF" -hide_banner -loglevel error -y -f concat -safe 0 -i list.txt -c copy combined.mp4 )
fi
echo "   duração final: $(duration "$COMBINED")s"

echo "== extraindo frames (alvo FPS=$FPS) =="
rm -rf "$OUT" && mkdir -p "$OUT"
"$FF" -hide_banner -loglevel error -y -i "$COMBINED" -vf "fps=$FPS" "$OUT/frame_%04d.png"
FRAMES=$(find "$OUT" -name '*.png' | wc -l)
echo "   $FRAMES frames extraídos"

echo "== codificando WebP =="
bash tools/encode-frames.sh "$OUT"
echo "Pronto. Defina data-frame-count=\"$FRAMES\" no index.html."
