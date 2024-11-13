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
  const usuarioAtual = await Usuario.findOne({ _idUser: idUser });
  if (!usuarioAtual) {
    throw new AppError('Usuário não encontrado', 404);
  }

  if ('cpfUsuario' in data && data.cpfUsuario !== usuarioAtual.cpfUsuario) {
    throw new AppError('Não é permitido alterar o CPF', 400);
  }

  if (data.email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Formato de email inválido', 400);
    }
  }

  const usuarioAtualizado = await Usuario.findOneAndUpdate(
    { _idUser: idUser },
    data,
    { new: true }
  );

  return usuarioAtualizado;
};