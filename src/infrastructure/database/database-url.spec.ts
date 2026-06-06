import { getDatabaseUrl } from './database-url';

describe('getDatabaseUrl', () => {
  const original = process.env;
  beforeEach(() => {
    process.env = {};
  });
  afterAll(() => {
    process.env = original;
  });

  it('prioriza DATABASE_URL', () => {
    process.env.DATABASE_URL = 'postgres://pronta';
    expect(getDatabaseUrl()).toBe('postgres://pronta');
  });

  it('retorna undefined sem configuracao completa', () => {
    process.env.PGHOST = 'host';
    expect(getDatabaseUrl()).toBeUndefined();
  });

  it('monta URL escapada com valores padrao e customizados', () => {
    Object.assign(process.env, {
      PGHOST: 'host',
      PGUSER: 'user name',
      PGPASSWORD: 'p@ss',
      PGDATABASE: 'db name',
    });
    expect(getDatabaseUrl()).toBe(
      'postgresql://user%20name:p%40ss@host:5432/db%20name?sslmode=require',
    );
    process.env.PGPORT = '5433';
    process.env.PGSSLMODE = 'disable';
    expect(getDatabaseUrl()).toContain(':5433/db%20name?sslmode=disable');
  });
});
