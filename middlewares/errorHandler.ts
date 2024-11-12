import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err instanceof AppError ? err.status : 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(statusCode).json({ message });
};

export default errorHandler;
