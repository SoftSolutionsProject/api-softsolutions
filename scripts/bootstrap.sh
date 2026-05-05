#!/bin/sh
set -eu

API_URL="${API_URL:-http://api:4000}"
HEALTH_URL="${HEALTH_URL:-$API_URL/health}"
REINDEX_URL="${REINDEX_URL:-$API_URL/search/reindex}"

log() {
  echo "[bootstrap] $1"
}

log "Aguardando a API ficar disponível em ${HEALTH_URL}..."
./scripts/await-for-api.sh "${HEALTH_URL}"

log "API disponível."

log "Executando migrations..."
npm run migration:run

log "Migrations executadas com sucesso."

log "Executando seed..."
npm run seed

log "Seed executado com sucesso."

log "Chamando reindexação em ${REINDEX_URL}..."
curl --fail --silent --show-error -X POST "${REINDEX_URL}"

log "Reindexação concluída com sucesso."
log "Bootstrap concluído com sucesso."