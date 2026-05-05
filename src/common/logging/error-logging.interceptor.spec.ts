import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError, lastValueFrom } from 'rxjs';
import { ErrorLoggingInterceptor } from './error-logging.interceptor';

describe('ErrorLoggingInterceptor', () => {
  let interceptor: ErrorLoggingInterceptor;
  let logger: { error: jest.Mock };

  beforeEach(() => {
    logger = { error: jest.fn() };
    interceptor = new ErrorLoggingInterceptor(logger as any);
  });

  const createContext = (request?: any, className?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getClass: () => (className ? { name: className } : undefined),
    }) as any;

  it('deve retornar o observable normalmente no happy path', async () => {
    const result = interceptor.intercept(createContext({ requestId: 'req-1' }), {
      handle: () => of('ok'),
    } as CallHandler);

    await expect(lastValueFrom(result as any)).resolves.toBe('ok');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('deve logar erro com requestId e contexto da classe', async () => {
    const error = new Error('falhou');
    const result = interceptor.intercept(
      createContext({ requestId: 'req-1' }, 'UsersController'),
      {
        handle: () => throwError(() => error),
      } as CallHandler,
    );

    await expect(lastValueFrom(result as any)).rejects.toBe(error);
    expect(logger.error).toHaveBeenCalledWith(
      { message: 'falhou', requestId: 'req-1' },
      error.stack,
      'UsersController',
    );
  });

  it('deve usar fallbacks quando request ou classe não existirem', async () => {
    const error = { stack: 'stack-only' };
    const result = interceptor.intercept(createContext(undefined, undefined), {
      handle: () => throwError(() => error),
    } as CallHandler);

    await expect(lastValueFrom(result as any)).rejects.toBe(error);
    expect(logger.error).toHaveBeenCalledWith(
      { message: 'Unhandled exception', requestId: undefined },
      'stack-only',
      'ErrorLoggingInterceptor',
    );
  });
});
