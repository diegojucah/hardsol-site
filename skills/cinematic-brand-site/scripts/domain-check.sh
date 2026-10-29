#!/usr/bin/env bash
# Consulta disponibilidade de domínio via RDAP (sem whois, sem captcha).
# Uso: bash scripts/domain-check.sh empresa.com.br empresa.com
#
# Decisão pelo HTTP status, não pelo exit code do curl:
#   200 -> registrado (o corpo traz expiração e registrante)
#   404 -> livre
#   outro -> erro de consulta
set -u

UA="Mozilla/5.0 (compatible; domain-check/1.0)"

check() {
  local d="$1" tld="${1##*.}" url tmp code
  case "$tld" in
    br)  url="https://rdap.registro.br/domain/$d" ;;
    com|net|org) url="https://rdap.verisign.com/com/v1/domain/$d" ;;
    *) echo "$d -> consulte o RDAP do registro do TLD .$tld"; return ;;
  esac

  tmp="$(mktemp)"
  code="$(curl -s -m 20 -A "$UA" -H "Accept: application/rdap+json" -o "$tmp" -w "%{http_code}" "$url" 2>/dev/null)"

  case "$code" in
    200)
      local expir reg
      expir="$(grep -o '"eventAction":"expiration","eventDate":"[^"]*"' "$tmp" | head -1 | sed 's/.*:"//;s/"$//')"
      reg="$(grep -o '"fn",{},"text","[^"]*"' "$tmp" | head -1 | sed 's/.*"text","//;s/"$//')"
      echo "$d -> REGISTRADO${expir:+  expira $expir}${reg:+  registrante: $reg}"
      ;;
    404) echo "$d -> LIVRE" ;;
    000|"") echo "$d -> sem resposta (rede bloqueada?)" ;;
    *) echo "$d -> erro de consulta (HTTP $code)" ;;
  esac
  rm -f "$tmp"
}

[ "$#" -eq 0 ] && { echo "Uso: bash scripts/domain-check.sh dominio [dominio...]"; exit 1; }
for d in "$@"; do check "$d"; sleep 1; done
