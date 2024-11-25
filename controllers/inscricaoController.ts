// controllers/inscricaoController.ts
import { Request, Response, NextFunction } from 'express';
import * as inscricaoService from '../services/inscricaoService';
import { AppError } from '../utils/AppError';

export const inscreverCurso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idUser = req.user?._idUser;

    // Verificar se o usuário está tentando se inscrever em seu próprio perfil
    if (req.body._idUser !== idUser) {
      throw new AppError('Acesso não autorizado', 403);
    }

    const inscricao = await inscricaoService.inscreverCurso(req.body);
    res.status(201).json(inscricao);
  } catch (error) {
    next(error);
  }
};

export const obterInscricoes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idUser = req.user?._idUser;

    if (parseInt(req.params.idUser) !== idUser) {
      throw new AppError('Acesso não autorizado', 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const inscricoes = await inscricaoService.obterInscricoes(idUser, page, limit);
    res.status(200).json(inscricoes);
  } catch (error) {
    next(error);
  }
};

export const cancelarInscricao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idUser = req.user?._idUser;

    if (parseInt(req.params.idUser) !== idUser) {
      throw new AppError('Acesso não autorizado', 403);
    }

    await inscricaoService.cancelarInscricao(idUser, parseInt(req.params.idCurso));
    res.status(200).json({ message: 'Inscrição cancelada com sucesso' });
  } catch (error) {
    next(error);
  }
};
