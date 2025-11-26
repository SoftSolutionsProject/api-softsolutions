import { ConsoleLogger } from '@nestjs/common';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class JsonLogger extends ConsoleLogger {
  private write(payload: Record<string, unknown>) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  }

  private preparePayload(
    level: LogLevel,
    message: unknown,
    context?: string,
    stack?: string,
  ): Record<string, unknown> {
    const base: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
    };

    if (context) {
      base.context = context;
    }

    if (message instanceof Error) {
      base.message = message.message;
      base.stack = stack ?? message.stack;
    } else if (typeof message === 'object' && message !== null) {
      const { message: innerMessage, ...rest } = message as Record<
        string,
        unknown
      >;
      base.message =
        typeof innerMessage === 'string'
          ? innerMessage
          : this.coerceMessage(innerMessage ?? message);
      Object.assign(base, rest);
    } else {
      base.message = this.coerceMessage(message);
    }

    if (stack && !base.stack) {
      base.stack = stack;
    }

    return base;
  }

  private coerceMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }

  log(message: unknown, context?: string): void {
    this.write(this.preparePayload('info', message, context));
  }

  warn(message: unknown, context?: string): void {
    this.write(this.preparePayload('warn', message, context));
  }

  debug(message: unknown, context?: string): void {
    this.write(this.preparePayload('debug', message, context));
  }

  error(message: unknown, stack?: string, context?: string): void {
    this.write(this.preparePayload('error', message, context, stack));
  }
}
