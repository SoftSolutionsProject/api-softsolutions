import { JsonLogger } from './json-logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true as any);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  const getPayload = () =>
    JSON.parse(String(stdoutSpy.mock.calls.at(-1)?.[0] ?? '').trim());

  it('deve logar mensagem string com contexto', () => {
    logger.log('mensagem info', 'contexto');

    expect(getPayload()).toEqual(
      expect.objectContaining({
        level: 'info',
        message: 'mensagem info',
        context: 'contexto',
      }),
    );
  });

  it('deve logar warn sem contexto', () => {
    logger.warn('mensagem warn');

    expect(getPayload()).toEqual(
      expect.objectContaining({
        level: 'warn',
        message: 'mensagem warn',
      }),
    );
    expect(getPayload().context).toBeUndefined();
  });

  it('deve logar debug com objeto e preservar campos extras', () => {
    logger.debug({ message: 'mensagem debug', requestId: 'req-1' }, 'Search');

    expect(getPayload()).toEqual(
      expect.objectContaining({
        level: 'debug',
        message: 'mensagem debug',
        context: 'Search',
        requestId: 'req-1',
      }),
    );
  });

  it('deve logar error de instância Error usando stack do próprio erro', () => {
    const error = new Error('mensagem erro');
    logger.error(error, undefined, 'Errors');

    expect(getPayload()).toEqual(
      expect.objectContaining({
        level: 'error',
        message: 'mensagem erro',
        context: 'Errors',
        stack: error.stack,
      }),
    );
  });

  it('deve usar stack explícita quando mensagem for objeto sem stack', () => {
    logger.error({ code: 500 }, 'stack-explicita', 'Errors');

    expect(getPayload()).toEqual(
      expect.objectContaining({
        level: 'error',
        message: '{"code":500}',
        context: 'Errors',
        stack: 'stack-explicita',
      }),
    );
  });

  it('deve fazer fallback para String quando a mensagem não puder ser serializada', () => {
    const circular: any = {};
    circular.self = circular;

    logger.log({ message: circular });

    expect(getPayload()).toEqual(
      expect.objectContaining({
        level: 'info',
        message: '[object Object]',
      }),
    );
  });
});
