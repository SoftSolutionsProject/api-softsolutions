const fs = require('fs');
const path = require('path');
const { Meilisearch } = require('meilisearch');

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700';
const MEILI_KEY = process.env.MEILI_MASTER_KEY;
const INDEX_UID = process.env.MEILI_INDEX_UID || 'softsolutions';

function safeText(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(safeText).join(' ');
  if (typeof value === 'object') return Object.values(value).map(safeText).join(' ');
  return String(value).normalize('NFC').trim();
}

function buildSearchText(item, type) {
  return [
    type,
    safeText(item.nomeCurso),
    safeText(item.nomeModulo),
    safeText(item.nomeAula),
    safeText(item.titulo),
    safeText(item.descricao),
    safeText(item.descricaoConteudo),
    safeText(item.categoria),
    safeText(item.conteudo),
    safeText(item.tags),
  ]
    .filter(Boolean)
    .join(' ');
}

function normalizeDoc(item, type) {
  return {
    ...item,
    _type: type,
    searchText: buildSearchText(item, type),
  };
}

async function main() {
  if (!MEILI_KEY) throw new Error('MEILI_MASTER_KEY não definida');

  const filePath = path.join(__dirname, '..', 'output', 'neon-export.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  const client = new Meilisearch({ host: MEILI_HOST, apiKey: MEILI_KEY });
  const index = client.index(INDEX_UID);

  const docs = [
    ...(data.cursos || []).map((item) => normalizeDoc(item, 'curso')),
    ...(data.modulos || []).map((item) => normalizeDoc(item, 'modulo')),
    ...(data.aulas || []).map((item) => normalizeDoc(item, 'aula')),
  ];

  if (!docs.length) throw new Error('Nenhum documento para indexar');

  const task = await index.addDocuments(docs);
  console.log('Task:', task);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});