import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _idUser: number;
      tipo: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError('Token não fornecido', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _idUser: number; tipo: string };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Token inválido', 401);
    }
    next(error);
  }
};