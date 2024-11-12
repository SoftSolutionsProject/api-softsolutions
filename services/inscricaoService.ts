import Inscricao, { IInscricao } from '../models/Inscricao';
import { AppError } from '../utils/AppError';

export const inscreverCurso = async ({ _idModulo, _idUser }: { _idModulo: number; _idUser: number }): Promise<IInscricao> => {
  const inscricaoExistente = await Inscricao.findOne({ _idUser, _idModulo });
  if (inscricaoExistente) {
    throw new AppError('Usuário já está inscrito neste módulo.', 400);
  }

  const novaInscricao = new Inscricao({ statusInscricao: 0, _idModulo, _idUser });
  return await novaInscricao.save();
};

export const obterInscricoes = async (idUser: number): Promise<IInscricao[]> => {
  const inscricoes = await Inscricao.find({ _idUser: idUser });
  if (inscricoes.length === 0) {
    throw new AppError('Nenhuma inscrição encontrada para este usuário.', 404);
  }
  return inscricoes;
};

export const cancelarInscricao = async (idUser: number, idModulo: number): Promise<void> => {
  const resultado = await Inscricao.findOneAndDelete({ _idUser: idUser, _idModulo: idModulo });
  if (!resultado) {
    throw new AppError('Inscrição não encontrada', 404);
  }
};
