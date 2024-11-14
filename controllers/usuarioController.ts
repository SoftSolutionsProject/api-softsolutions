import { Request, Response, NextFunction } from 'express';
import * as usuarioService from '../services/usuarioService';

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
    const usuario = await usuarioService.obterUsuario(parseInt(req.params.idUser));
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const atualizarUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuarioAtualizado = await usuarioService.atualizarUsuario(parseInt(req.params.idUser), req.body);
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    next(error);
  }
};
