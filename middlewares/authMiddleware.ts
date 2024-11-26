import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; // Atualização aqui
import { AppError } from '../utils/AppError';

// Declaração de tipos no objeto `req` do Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _idUser: number;
      tipo: string;
    };
  }
}

// Certifique-se de que a variável de ambiente `JWT_SECRET` está configurada
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Token não fornecido', 401);
    }

    // Verificação do token com tratamento de erro
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { _idUser: number; tipo: string };
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // Token inválido ou expirado
        throw new AppError('Token inválido', 401);
      }
      // Outros erros inesperados
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
