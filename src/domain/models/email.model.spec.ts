import { EmailModel } from './email.model';

describe('EmailModel', () => {
  it('deve criar um modelo de email', () => {
    const model: EmailModel = {
      nome: 'Fulano',
      email: 'fulano@teste.com',
      assunto: 'Teste',
      mensagem: 'Mensagem de teste',
    };
    expect(model).toBeDefined();
    expect(model.email).toBe('fulano@teste.com');
  });
});
