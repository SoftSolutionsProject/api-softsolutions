
import { RequestLoggingMiddleware, RequestWithId } from './request-logging.middleware';
import { JsonLogger } from './json-logger';

describe('RequestLoggingMiddleware', () => {
  let middleware: RequestLoggingMiddleware;
  let req: Partial<RequestWithId>;
  let res: any;
  let next: jest.Mock;
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    middleware = new RequestLoggingMiddleware(logger);
    req = { method: 'GET', url: '/rota', headers: {}, body: {} };
    res = { on: jest.fn((event, cb) => { if (event === 'finish') cb(); }), statusCode: 200 };
    next = jest.fn();
  });

  it('deve chamar next()', () => {
    middleware.use(req as any, res, next);
    expect(next).toHaveBeenCalled();
  });
});
