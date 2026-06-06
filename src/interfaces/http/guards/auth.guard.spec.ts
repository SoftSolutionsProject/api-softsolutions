import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from './auth.guard';

jest.mock('jsonwebtoken');

describe('AuthGuard', () => {
  const guard = new AuthGuard();
  const request: any = { headers: {} };
  const context: any = { switchToHttp: () => ({ getRequest: () => request }) };

  beforeEach(() => {
    jest.clearAllMocks();
    request.headers = {};
    delete request.user;
  });

  it('rejeita requisicao sem token', () => {
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('aceita token valido e adiciona usuario', () => {
    request.headers.authorization = 'Bearer token';
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 1 });
    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({ sub: 1 });
  });

  it('rejeita token invalido', () => {
    request.headers.authorization = 'Bearer token';
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid');
    });
    expect(() => guard.canActivate(context)).toThrow(
      'Token inválido ou expirado',
    );
  });
});
