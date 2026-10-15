#!/usr/bin/env bash
# Codifica uma sequência de PNGs em conjuntos WebP (desktop + mobile) para o site.
#
# Uso:
#   bash tools/encode-frames.sh /tmp/film_png
#
# Regra do método: o "grade" (contraste/saturação/sharpen) é ASSADO nos arquivos.
# Nunca aplique grade em runtime no navegador.
set -eu
cd "$(dirname "$0")/.."

SRC="${1:-/tmp/film_png}"
FF="$(node -e "process.stdout.write(require('./tools/node_modules/ffmpeg-static'))")"

if [ ! -x "$FF" ]; then
  echo "ffmpeg-static não encontrado. Rode: cd tools && npm install" >&2
  exit 1
fi
if [ ! -d "$SRC" ]; then
  echo "Pasta de origem inexistente: $SRC" >&2
  exit 1
fi

rm -rf frames/desktop frames/mobile
mkdir -p frames/desktop frames/mobile

echo "== desktop 1600x900 (grade suave assado) =="
"$FF" -hide_banner -loglevel error -y -i "$SRC/frame_%04d.png" \
  -vf "scale=1600:900:flags=lanczos,eq=contrast=1.06:saturation=1.08,unsharp=5:5:0.4" \
  -c:v libwebp -quality 80 -compression_level 6 \
  frames/desktop/frame_%04d.webp

echo "== mobile 960x540 =="
"$FF" -hide_banner -loglevel error -y -i "$SRC/frame_%04d.png" \
  -vf "scale=960:540:flags=lanczos,eq=contrast=1.06:saturation=1.08" \
  -c:v libwebp -quality 78 -compression_level 6 \
  frames/mobile/frame_%04d.webp

D=$(find frames/desktop -name '*.webp' | wc -l)
M=$(find frames/mobile -name '*.webp' | wc -l)
echo "OK  desktop=$D  mobile=$M"
du -sh frames/desktop frames/mobile
