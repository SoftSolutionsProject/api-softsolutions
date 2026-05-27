const REQUIRED_PG_ENV_VARS = [
  'PGHOST',
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE',
] as const;

export function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const hasPgConfig = REQUIRED_PG_ENV_VARS.every((key) => process.env[key]);

  if (!hasPgConfig) {
    return undefined;
  }

  const user = encodeURIComponent(process.env.PGUSER as string);
  const password = encodeURIComponent(process.env.PGPASSWORD as string);
  const host = process.env.PGHOST;
  const port = process.env.PGPORT || '5432';
  const database = encodeURIComponent(process.env.PGDATABASE as string);
  const sslMode = process.env.PGSSLMODE || 'require';

  return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=${sslMode}`;
}
