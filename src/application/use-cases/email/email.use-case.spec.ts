import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EnviarEmailUseCase } from './enviar-email.use-case';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('EnviarEmailUseCase', () => {
  let useCase: EnviarEmailUseCase;
  let verifyMock: jest.Mock;
  let sendMailMock: jest.Mock;
  const envBackup = process.env;

  const dto = {
    nome: 'Lucas',
    email: 'lucas@email.com',
    assunto: 'Contato',
    mensagem: 'Mensagem valida com mais de 10 caracteres',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...envBackup,
      EMAIL_SUPPORT_USER: 'support@email.com',
      EMAIL_SUPPORT_PASS: 'secret',
      EMAIL_SUPPORT_DESTINATION: 'dest@email.com',
    };

    verifyMock = jest.fn().mockResolvedValue(undefined);
    sendMailMock = jest.fn().mockResolvedValue(undefined);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      verify: verifyMock,
      sendMail: sendMailMock,
    });

    useCase = new EnviarEmailUseCase();
  });

  afterAll(() => {
    process.env = envBackup;
  });

  it('deve enviar email com sucesso', async () => {
    await expect(useCase.execute(dto as any)).resolves.toEqual({
      message: 'E-mail enviado com sucesso!',
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'support@email.com',
        pass: 'secret',
      },
    });
    expect(verifyMock).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'Lucas <support@email.com>',
      replyTo: 'lucas@email.com',
      to: 'dest@email.com',
      subject: 'Contato - Contato',
      text: 'Mensagem de: Lucas <lucas@email.com>\n\nMensagem valida com mais de 10 caracteres',
    });
  });

  it('deve lançar erro quando faltarem campos obrigatórios', async () => {
    await expect(
      useCase.execute({ ...dto, nome: '' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar erro para email inválido', async () => {
    await expect(
      useCase.execute({ ...dto, email: 'invalido' } as any),
    ).rejects.toThrow('Email inválido');
  });

  it('deve lançar erro para mensagem curta', async () => {
    await expect(
      useCase.execute({ ...dto, mensagem: 'curta' } as any),
    ).rejects.toThrow('A mensagem deve ter pelo menos 10 caracteres');
  });

  it('deve lançar erro quando variáveis de ambiente não estiverem definidas', async () => {
    delete process.env.EMAIL_SUPPORT_USER;

    await expect(useCase.execute(dto as any)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('deve propagar erro do verify', async () => {
    verifyMock.mockRejectedValueOnce(new Error('smtp indisponivel'));

    await expect(useCase.execute(dto as any)).rejects.toThrow(
      'smtp indisponivel',
    );
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
