import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

import { JsonLogger } from './json-logger';
import { RequestWithId } from './request-logging.middleware';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: JsonLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithId>();
    const requestId = request?.requestId;
    const contextName = context.getClass()?.name || ErrorLoggingInterceptor.name;

    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(
          {
            message: error?.message || 'Unhandled exception',
            requestId,
          },
          error?.stack,
          contextName,
        );

        return throwError(() => error);
      }),
    );
  }
}
