import { Request, Response, NextFunction } from 'express';
import * as inscricaoService from '../services/inscricaoService';

export const inscreverCurso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const inscricao = await inscricaoService.inscreverCurso(req.body);
    res.status(201).json(inscricao);
  } catch (error) {
    next(error);
  }
};

export const obterInscricoes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const inscricoes = await inscricaoService.obterInscricoes(parseInt(req.params.idUser));
    res.status(200).json(inscricoes);
  } catch (error) {
    next(error);
  }
};

export const cancelarInscricao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await inscricaoService.cancelarInscricao(parseInt(req.params.idUser), parseInt(req.params.idModulo));
    res.status(200).json({ message: 'Inscrição cancelada com sucesso' });
  } catch (error) {
    next(error);
  }
};
