import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

import { JsonLogger } from './json-logger';

export interface RequestWithId extends Request {
  requestId?: string;
}

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: JsonLogger) {}

  use(req: RequestWithId, res: Response, next: NextFunction): void {
    const requestId = randomUUID();
    req.requestId = requestId;
    const startedAt = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;

      this.logger.log(
        {
          message: 'Request completed',
          method: req.method,
          path: req.originalUrl || req.url,
          statusCode: res.statusCode,
          durationMs,
          requestId,
        },
        RequestLoggingMiddleware.name,
      );
    });

    next();
  }
}
