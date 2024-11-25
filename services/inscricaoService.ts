import Inscricao, { IInscricao } from '../models/Inscricao';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';


export const inscreverCurso = async ({ _idCurso, _idUser }: { _idCurso: number; _idUser: number }): Promise<IInscricao> => {
  const inscricaoExistente = await Inscricao.findOne({ _idUser, _idCurso });
  if (inscricaoExistente) {
    throw new AppError('Usuário já está inscrito neste curso.', 400);
  }

  // Pegar módulos do curso para criar progresso inicial
  const curso = await mongoose.model('Curso').findOne({ _idCurso });
  if (!curso) {
    throw new AppError('Curso não encontrado.', 404);
  }

  const progresso = curso.modulos.map((modulo: any) => ({
    _idModulo: modulo._idModulo,
    status: 0, // Não iniciado
    aulasConcluidas: [],
  }));

  const novaInscricao = new Inscricao({
    _idCurso,
    _idUser,
    progresso,
  });

  return await novaInscricao.save();
};


export const obterInscricoes = async (idUser: number, page: number, limit: number): Promise<IInscricao[]> => {
  const skip = (page - 1) * limit; // Paginação

  const inscricoes = await Inscricao.find({ _idUser: idUser }).limit(limit).skip(skip);

  if (inscricoes.length === 0) {
    throw new AppError('Nenhuma inscrição encontrada para este usuário.', 404);
  }

  return inscricoes;
};


export const cancelarInscricao = async (idUser: number, idCurso: number): Promise<void> => {
  const resultado = await Inscricao.findOneAndDelete({ _idUser: idUser, _idCurso: idCurso });
  if (!resultado) {
    throw new AppError('Inscrição não encontrada', 404);
  }
};

