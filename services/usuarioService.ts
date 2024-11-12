import Usuario, { IUsuario } from '../models/Usuario';
import { AppError } from '../utils/AppError';

export const obterUsuario = async (idUser: number): Promise<IUsuario | null> => {
  const usuario = await Usuario.findOne({ _idUser: idUser });
  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404);
  }
  return usuario;
};

export const atualizarUsuario = async (idUser: number, data: Partial<IUsuario>): Promise<IUsuario | null> => {
  const usuarioAtualizado = await Usuario.findOneAndUpdate({ _idUser: idUser }, data, { new: true });
  if (!usuarioAtualizado) {
    throw new AppError('Usuário não encontrado', 404);
  }
  return usuarioAtualizado;
};
