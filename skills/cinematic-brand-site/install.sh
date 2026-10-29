#!/usr/bin/env bash
# Instala o pacote de skill no escopo do usuário (todos os projetos).
# Uso: bash install.sh            → ~/.commandcode/skills/cinematic-brand-site
#      bash install.sh --project  → ./.commandcode/skills/cinematic-brand-site
set -eu
cd "$(dirname "$0")"

NAME="cinematic-brand-site"
SRC="$(pwd)"

if [ "${1:-}" = "--project" ]; then
  DEST="$(git rev-parse --show-toplevel 2>/dev/null || echo ..)/.commandcode/skills/$NAME"
else
  DEST="$HOME/.commandcode/skills/$NAME"
fi

mkdir -p "$(dirname "$DEST")"
rm -rf "$DEST"
cp -R "$SRC" "$DEST"

echo "Instalado em: $DEST"
echo "Verifique com: cmd skills list   (ou /skills no TUI)"
