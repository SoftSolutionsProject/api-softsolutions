import { Request, Response, NextFunction } from 'express';
import { enviarEmailSuporte } from '../services/emailService';

export const enviarEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { nome, email, assunto, mensagem } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !email || !assunto || !mensagem) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // Enviar o e-mail
    await enviarEmailSuporte({ nome, email, assunto, mensagem });

    // Retornar sucesso
    return res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    next(error); // Delegar o erro ao middleware de erro
  }
};
