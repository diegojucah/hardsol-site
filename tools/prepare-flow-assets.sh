#!/usr/bin/env bash
# Prepara os ativos gerados no Google Flow:
#   1) move os originais da raiz para tools/flow-source/
#   2) converte os 6 stills 2K em WebP (full + card) em assets/img/flow/
#   3) encoda os 2 vídeos como o filme real (frames/desktop, frames/mobile)
#
# Uso:  bash tools/prepare-flow-assets.sh
set -eu
cd "$(dirname "$0")/.."

FF="$(node -e "process.stdout.write(require('./tools/node_modules/ffmpeg-static'))")"
SRC="tools/flow-source"
mkdir -p "$SRC" assets/img/flow tools/clips

echo "== 1. movendo originais para $SRC =="
for f in *.jpg *.mp4; do
  [ -e "$f" ] || continue
  mv -f "$f" "$SRC/"
  echo "   $f"
done

# still (substring do nome gerado pelo Flow)  ->  slug
stills() {
  cat <<'EOF'
Solar_panels_at_sunrise|cena-1-amanhecer
Sunlight_over_solar_panel_rows|cena-2-paineis
Modern_house_with_solar_panels|cena-3-casa
Electric_car_charging_in_garage|cena-4-carro
Solar_water_pump_in_farmland|cena-5-agua
Solar_panels_glowing_over_city|cena-6-cidade
EOF
}

echo "== 2. stills 2K -> WebP (full 1600w + card 800w) =="
stills | while IFS='|' read -r key slug; do
  src="$(find "$SRC" -maxdepth 1 -iname "*${key}*.jpg" | head -1)"
  if [ -z "$src" ]; then echo "   FALTA still: $key"; continue; fi
  "$FF" -hide_banner -loglevel error -y -i "$src" -vf "scale=1600:-2" -c:v libwebp -quality 82 "assets/img/flow/${slug}.webp"
  "$FF" -hide_banner -loglevel error -y -i "$src" -vf "scale=800:-2" -c:v libwebp -quality 80 "assets/img/flow/${slug}-card.webp"
  echo "   ${slug}.webp + ${slug}-card.webp"
done

echo "== 3. vídeos -> tools/clips =="
v1="$(find "$SRC" -maxdepth 1 -iname "*Sun_rises_behind_solar_panels*.mp4" | head -1)"
v2="$(find "$SRC" -maxdepth 1 -iname "*Sunlight_reflecting*.mp4" | head -1)"
[ -n "$v1" ] && cp -f "$v1" tools/clips/scene1.mp4 && echo "   scene1.mp4 <- $(basename "$v1")"
[ -n "$v2" ] && cp -f "$v2" tools/clips/scene2.mp4 && echo "   scene2.mp4 <- $(basename "$v2")"

if [ -f tools/clips/scene1.mp4 ] && [ -f tools/clips/scene2.mp4 ]; then
  echo "== 4. encodando o filme (abertura curta + cross-dissolve, FPS=12) =="
  LEAD_IN=3 XFADE=1 FPS=12 bash tools/encode-real-film.sh
  echo
  echo "Ajuste data-frame-count no index.html com o total de frames acima."
else
  echo "!! vídeos não encontrados — pulando a codificação do filme"
fi
