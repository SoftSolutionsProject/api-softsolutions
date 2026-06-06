import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EnviarEmailUseCase } from './enviar-email.use-case';

jest.mock('nodemailer');

describe('EnviarEmailUseCase', () => {
  const originalEnv = process.env;
  const verify = jest.fn();
  const sendMail = jest.fn();
  const valid = {
    nome: 'Nome',
    email: 'nome@email.com',
    assunto: 'Ajuda',
    mensagem: 'Mensagem valida',
  };
  let useCase: EnviarEmailUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    useCase = new EnviarEmailUseCase();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      verify,
      sendMail,
    });
  });
  afterAll(() => {
    process.env = originalEnv;
  });

  it.each([
    [{ ...valid, nome: '' }, 'Todos os campos'],
    [{ ...valid, email: 'invalido' }, 'Email inválido'],
    [{ ...valid, mensagem: 'curta' }, 'pelo menos 10'],
  ])('valida entrada', async (dto, message) => {
    await expect(useCase.execute(dto)).rejects.toThrow(message);
  });

  it('exige configuracao de email', async () => {
    delete process.env.EMAIL_SUPPORT_USER;
    await expect(useCase.execute(valid)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('verifica transporte e envia email', async () => {
    process.env.EMAIL_SUPPORT_USER = 'support@email.com';
    process.env.EMAIL_SUPPORT_PASS = 'pass';
    process.env.EMAIL_SUPPORT_DESTINATION = 'dest@email.com';
    verify.mockResolvedValue(true);
    sendMail.mockResolvedValue({});
    await expect(useCase.execute(valid)).resolves.toEqual({
      message: 'E-mail enviado com sucesso!',
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: valid.email,
        to: 'dest@email.com',
      }),
    );
  });
});
