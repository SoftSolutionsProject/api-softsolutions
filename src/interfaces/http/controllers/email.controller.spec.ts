import { EmailController } from './email.controller';

describe('EmailController', () => {
  let controller: EmailController;
  let enviarEmailUseCase: { execute: jest.Mock };

  beforeEach(() => {
    enviarEmailUseCase = { execute: jest.fn() };
    controller = new EmailController(enviarEmailUseCase as any);
  });

  it('deve delegar o envio de email ao use case', async () => {
    const dto = {
      nome: 'Lucas',
      email: 'lucas@email.com',
      assunto: 'Ajuda',
      mensagem: 'Preciso de suporte com a plataforma',
    };
    enviarEmailUseCase.execute.mockResolvedValue({ message: 'ok' });

    await expect(controller.enviarEmail(dto as any)).resolves.toEqual({
      message: 'ok',
    });
    expect(enviarEmailUseCase.execute).toHaveBeenCalledWith(dto);
  });
});
