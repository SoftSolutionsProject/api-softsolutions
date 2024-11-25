import { Request, Response, NextFunction } from 'express';
import * as courseService from '../services/cursoService';
import { AppError } from '../utils/AppError';

export const adicionarCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const curso = await courseService.adicionarCurso(req.body);
    res.status(201).json(curso);
  } catch (error) {
    next(error);
  }
};

export const obterCursos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idCurso = req.params.idCurso ? parseInt(req.params.idCurso, 10) : undefined;
  
      if (idCurso) {
        // Buscar um curso específico
        const curso = await courseService.obterCursoPorId(idCurso);
        if (!curso) {
          throw new AppError('Curso não encontrado', 404);
        }
        res.status(200).json(curso);
      } else {
        // Buscar todos os cursos
        const cursos = await courseService.obterTodosCursos();
        res.status(200).json(cursos);
      }
    } catch (error) {
      next(error);
    }
  };