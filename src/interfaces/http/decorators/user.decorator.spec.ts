jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    createParamDecorator: jest.fn((factory) => ({ factory })),
  };
});

import { User } from './user.decorator';

describe('User decorator', () => {
  const createContext = (user: any) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as any;

  it('deve retornar o usuário inteiro quando data não for informada', () => {
    const user = { sub: 1, tipo: 'aluno' };

    expect((User as any).factory(undefined, createContext(user))).toEqual(user);
  });

  it('deve retornar a propriedade específica quando data for informada', () => {
    expect((User as any).factory('sub', createContext({ sub: 5 }))).toBe(5);
  });

  it('deve retornar undefined quando não houver usuário ou propriedade', () => {
    expect((User as any).factory('sub', createContext(undefined))).toBeUndefined();
    expect((User as any).factory('tipo', createContext({}))).toBeUndefined();
  });
});
