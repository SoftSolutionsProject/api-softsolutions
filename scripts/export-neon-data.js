const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function exportTable(tableName) {
  const { rows } = await client.query(`SELECT * FROM ${tableName}`);
  return rows;
}

async function main() {
  await client.connect();

  const cursos = await exportTable('cursos');
  const modulos = await exportTable('modulos');
  const aulas = await exportTable('aulas');

  const payload = { cursos, modulos, aulas };

  const outDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, 'neon-export.json'),
    JSON.stringify(payload, null, 2),
    'utf8'
  );

  await client.end();
  console.log('Export concluído: output/neon-export.json');
}

main().catch(async (err) => {
  console.error(err);
  try { await client.end(); } catch {}
  process.exit(1);
});