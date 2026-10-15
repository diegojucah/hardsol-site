#!/usr/bin/env bash
# Reenvia todas as URLs do sitemap para o IndexNow (Bing, Yandex, Seznam, Naver).
# Use depois de publicar mudanças de conteúdo.
#
# Uso:  bash tools/submit-indexnow.sh
set -eu
cd "$(dirname "$0")/.."

HOST_KEY_FILE=".indexnow-key"
if [ ! -f "$HOST_KEY_FILE" ]; then
  echo "Arquivo $HOST_KEY_FILE não encontrado (contém a chave do IndexNow)." >&2
  exit 1
fi
KEY="$(cat "$HOST_KEY_FILE")"
BASE="$(node -e "process.stdout.write(require('./site.config.json').baseUrl.replace(/\/+$/,''))")"
HOST="$(node -e "process.stdout.write(new URL(process.argv[1]).host)" "$BASE")"

node -e '
const fs = require("fs");
const base = process.argv[1], key = process.argv[2], host = process.argv[3];
const urls = fs.readFileSync("sitemap.xml", "utf8").match(/<loc>([^<]+)<\/loc>/g).map(s => s.replace(/<\/?loc>/g, ""));
fs.writeFileSync("/tmp/indexnow.json", JSON.stringify({ host, key, keyLocation: base + "/" + key + ".txt", urlList: urls }));
console.log("URLs: " + urls.length);
' "$BASE" "$KEY" "$HOST"

echo "Enviando para o IndexNow ($HOST)..."
curl -s -o /tmp/indexnow.out -w "HTTP %{http_code}\n" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @/tmp/indexnow.json --max-time 30
[ -s /tmp/indexnow.out ] && cat /tmp/indexnow.out || echo "(202/200 = aceito)"
