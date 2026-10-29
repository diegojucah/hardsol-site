#!/usr/bin/env bash
# Extrai a cor média de imagens (feed, logo, capas) para apoiar a paleta da marca.
# Requer ffmpeg. Uso: bash scripts/palette.sh ./scan/*.jpg
set -u

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg não encontrado. Instale ou use um extrator online."; exit 1; }
[ "$#" -eq 0 ] && { echo "Uso: bash scripts/palette.sh <imagens...>"; exit 1; }

hex() { printf "#%02X%02X%02X" "$1" "$2" "$3"; }

echo "arquivo                                   RGB média          HEX"
for f in "$@"; do
  [ -f "$f" ] || continue
  rgb=$(ffmpeg -v error -i "$f" -vf "scale=1:1" -f rawvideo -pix_fmt rgb24 - 2>/dev/null | od -An -tu1 | tr -s ' ')
  [ -z "$rgb" ] && continue
  set -- $rgb
  printf "%-40s %-18s %s\n" "$(basename "$f" | cut -c1-40)" "$1,$2,$3" "$(hex "$1" "$2" "$3")"
done

echo
echo "Dica: rode também com 'scale=8:8' e agrupe as cores para achar a cor de MARCA"
echo "(a mais saturada e repetida nas capas), não a média do feed."
