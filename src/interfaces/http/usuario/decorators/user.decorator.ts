import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new Error('User not found in request - AuthGuard not working properly');
    }

    return data ? request.user[data] : request.user;
  }
);