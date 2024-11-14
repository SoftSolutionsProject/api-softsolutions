import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!roles.includes(req.user.tipo)) {
      throw new AppError('Acesso não autorizado', 403);
    }

    next();
  };
};