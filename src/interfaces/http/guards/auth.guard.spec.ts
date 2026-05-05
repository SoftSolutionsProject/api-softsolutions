import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from './auth.guard';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const createContext = (authorization?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authorization ? { authorization } : {},
        }),
      }),
    }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard();
    process.env.JWT_SECRET = 'secret';
  });

  it('deve autenticar com token válido e anexar user na request', () => {
    const request: any = { headers: { authorization: 'Bearer token-123' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 1, tipo: 'aluno' });

    expect(guard.canActivate(context)).toBe(true);
    expect(jwt.verify).toHaveBeenCalledWith('token-123', 'secret');
    expect(request.user).toEqual({ sub: 1, tipo: 'aluno' });
  });

  it('deve lançar erro quando o header não existir', () => {
    expect(() => guard.canActivate(createContext())).toThrow(
      new UnauthorizedException('Token não informado'),
    );
  });

  it('deve lançar erro quando o token for inválido', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid');
    });

    expect(() => guard.canActivate(createContext('Bearer token-123'))).toThrow(
      new UnauthorizedException('Token inválido ou expirado'),
    );
  });
});
