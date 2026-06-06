import { of, throwError } from 'rxjs';
import { ErrorLoggingInterceptor } from './error-logging.interceptor';
import { JsonLogger } from './json-logger';
import { RequestLoggingMiddleware } from './request-logging.middleware';

describe('Logging', () => {
  it('escreve todos niveis em JSON e trata diferentes mensagens', () => {
    const logger = new JsonLogger();
    const write = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    logger.log('texto', 'Ctx');
    logger.warn({ message: 'aviso', extra: 1 });
    logger.debug({ value: 1 });
    logger.error(new Error('erro'), 'stack', 'Ctx');
    const circular: any = {};
    circular.self = circular;
    logger.log({ message: circular });
    expect(write).toHaveBeenCalledTimes(5);
    expect(write.mock.calls[0][0]).toContain('"level":"info"');
    expect(write.mock.calls[3][0]).toContain('"stack":"stack"');
    write.mockRestore();
  });

  it('registra erro do interceptor e relanca', (done) => {
    const logger = { error: jest.fn() };
    const interceptor = new ErrorLoggingInterceptor(logger as any);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ requestId: 'id' }) }),
      getClass: () => class Controller {},
    };
    interceptor
      .intercept(context as any, {
        handle: () => throwError(() => new Error('falha')),
      })
      .subscribe({
        error: (error) => {
          expect(error.message).toBe('falha');
          expect(logger.error).toHaveBeenCalled();
          done();
        },
      });
  });

  it('deixa resposta normal passar pelo interceptor', (done) => {
    const interceptor = new ErrorLoggingInterceptor({
      error: jest.fn(),
    } as any);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({}) }),
      getClass: () => undefined,
    };
    interceptor
      .intercept(context as any, { handle: () => of('ok') })
      .subscribe((value) => {
        expect(value).toBe('ok');
        done();
      });
  });

  it('adiciona request id e registra ao finalizar resposta', () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(100).mockReturnValueOnce(125);
    const logger = { log: jest.fn() };
    const middleware = new RequestLoggingMiddleware(logger as any);
    let finish!: () => void;
    const req: any = { method: 'GET', originalUrl: '/x' };
    const res: any = {
      statusCode: 200,
      on: (_: string, cb: () => void) => {
        finish = cb;
      },
    };
    const next = jest.fn();
    middleware.use(req, res, next);
    finish();
    expect(req.requestId).toBeTruthy();
    expect(next).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      expect.objectContaining({ durationMs: 25, path: '/x' }),
      'RequestLoggingMiddleware',
    );
    jest.restoreAllMocks();
  });

  it('usa req.url quando originalUrl não existe', () => {
    const logger = { log: jest.fn() };
    const middleware = new RequestLoggingMiddleware(logger as any);
    let finish!: () => void;
    const req: any = { method: 'GET', url: '/fallback' };
    const res: any = {
      statusCode: 204,
      on: (_: string, cb: () => void) => {
        finish = cb;
      },
    };
    middleware.use(req, res, jest.fn());
    finish();
    expect(logger.log).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/fallback' }),
      'RequestLoggingMiddleware',
    );
  });
});
