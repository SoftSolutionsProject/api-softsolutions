// models/Inscricao.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressoModulo {
  _idModulo: number; // ID único do módulo
  status: number; // 0 = Não iniciado, 1 = Em andamento, 2 = Concluído
  aulasConcluidas: number[]; // IDs das aulas que o aluno concluiu
}

export interface IInscricao extends Document {
  _idInscricao: number; // ID único da inscrição
  _idUser: number; // ID do usuário inscrito
  _idCurso: number; // ID do curso ao qual pertence
  progresso: IProgressoModulo[]; // Status de progresso em cada módulo
  dataInscricao: Date; // Data da inscrição
}

const ProgressoModuloSchema = new Schema<IProgressoModulo>({
  _idModulo: { type: Number, required: true },
  status: { type: Number, required: true, default: 0 }, // Padrão: Não iniciado
  aulasConcluidas: { type: [Number], default: [] }, // IDs das aulas concluídas
});

const InscricaoSchema = new Schema<IInscricao>({
  _idUser: { type: Number, required: true },
  _idCurso: { type: Number, required: true },
  progresso: { type: [ProgressoModuloSchema], required: true },
  dataInscricao: { type: Date, default: Date.now },
});


export default mongoose.model<IInscricao>('Inscricao', InscricaoSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Inscricao:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da inscrição gerado pelo MongoDB
 *         _idUser:
 *           type: number
 *           description: ID do usuário inscrito
 *         _idCurso:
 *           type: number
 *           description: ID do curso ao qual pertence
 *         progresso:
 *           type: array
 *           description: Progresso do usuário em cada módulo do curso
 *           items:
 *             type: object
 *             properties:
 *               _idModulo:
 *                 type: number
 *                 description: ID do módulo
 *               status:
 *                 type: number
 *                 description: Status do módulo (0 = Não iniciado, 1 = Em andamento, 2 = Concluído)
 *               aulasConcluidas:
 *                 type: array
 *                 description: IDs das aulas concluídas pelo usuário
 *                 items:
 *                   type: number
 *         dataInscricao:
 *           type: string
 *           format: date-time
 *           description: Data e hora da inscrição
 */

