import { Request, Response, NextFunction } from 'express';
import * as usuarioService from '../services/usuarioService';
import { AppError } from '../utils/AppError';


export const cadastrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await usuarioService.cadastrarUsuario(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, senha } = req.body;
    const result = await usuarioService.login(email, senha);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const obterUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idUser = parseInt(req.params.idUser);

    // Verificar se o usuário autenticado está tentando acessar seu próprio perfil
    if (req.user?._idUser !== idUser) {
      throw new AppError('Acesso não autorizado', 403);
    }

    const usuario = await usuarioService.obterUsuario(idUser);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const atualizarUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idUser = parseInt(req.params.idUser);

    // Verificar se o usuário autenticado está tentando editar seu próprio perfil
    if (req.user?._idUser !== idUser) {
      throw new AppError('Acesso não autorizado', 403);
    }

    const usuarioAtualizado = await usuarioService.atualizarUsuario(idUser, req.body);
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    next(error);
  }
};
