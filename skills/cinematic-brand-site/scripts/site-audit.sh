#!/usr/bin/env bash
# Auditoria do site atual de um prospect — gera munição comercial objetiva.
# Uso: bash scripts/site-audit.sh https://www.empresa.com.br/
set -u

URL="${1:-}"
[ -z "$URL" ] && { echo "Uso: bash scripts/site-audit.sh <url>"; exit 1; }

TMP="$(mktemp)"
START=$(date +%s%3N)
HTTP=$(curl -sSL -m 25 -A "Mozilla/5.0 (compatible; site-audit/1.0)" -o "$TMP" -w "%{http_code}" "$URL" 2>/dev/null)
END=$(date +%s%3N)
BYTES=$(wc -c < "$TMP" 2>/dev/null || echo 0)

has()   { grep -qiE "$1" "$TMP" && echo "sim" || echo "não"; }
count() { grep -oiE "$1" "$TMP" 2>/dev/null | wc -l | tr -d ' '; }
title() { grep -oiE '<title>[^<]*' "$TMP" | head -1 | sed 's/<title>//I'; }

echo "== Auditoria: $URL =="
echo "HTTP         : $HTTP"
echo "Resposta     : $((END - START)) ms"
echo "Peso do HTML : ${BYTES} bytes"
echo "Título       : $(title || echo '(sem título)')"
echo
echo "-- Conteúdo --"
echo "Palavras     : $(sed -e 's/<[^>]*>/ /g' "$TMP" | wc -w | tr -d ' ')"
echo "<img>        : $(count '<img')"
echo "<form>       : $(count '<form')"
echo "<h1>         : $(count '<h1')"
echo
echo "-- Técnico --"
echo "viewport     : $(has 'name=.viewport.')"
echo "description  : $(has 'name=.description.')"
echo "canonical    : $(has 'rel=.canonical.')"
echo "Open Graph   : $(has 'property=.og:')"
echo "JSON-LD      : $(has 'application/ld\+json')"
echo "WhatsApp     : $(has 'wa\.me|whatsapp')"
echo "Instagram    : $(has 'instagram\.com')"
echo
echo "-- Alertas --"
grep -qiE 'bootstrap 101 template|lorem ipsum|your awesome title|coming soon' "$TMP" \
  && echo "!! template/placeholder detectado"
[ "$BYTES" -lt 4000 ] && echo "!! HTML muito pequeno (provável página sem conteúdo)"
grep -qi 'name="viewport"' "$TMP" || echo "!! sem viewport: quebrado no celular"
rm -f "$TMP"
