#!/bin/sh
set -eu

URL="${1:-http://api:4000/health}"
MAX_RETRIES="${MAX_RETRIES:-30}"
SLEEP_SECONDS="${SLEEP_SECONDS:-2}"

i=1
while [ "$i" -le "$MAX_RETRIES" ]; do
  if curl --silent --fail --head "$URL" >/dev/null 2>&1; then
    exit 0
  fi

  echo "[await-for-api] Tentativa ${i}/${MAX_RETRIES} aguardando ${URL}..."
  sleep "$SLEEP_SECONDS"
  i=$((i + 1))
done

echo "[await-for-api] API não ficou disponível a tempo em ${URL}."
exit 1