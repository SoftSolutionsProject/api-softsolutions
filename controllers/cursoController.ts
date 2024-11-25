import { Request, Response, NextFunction } from 'express';
import * as courseService from '../services/cursoService';

export const adicionarCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const curso = await courseService.adicionarCurso(req.body);
    res.status(201).json(curso);
  } catch (error) {
    next(error);
  }
};
