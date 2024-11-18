import mongoose, { Document, Schema } from 'mongoose';

export interface IInscricao extends Document {
  statusInscricao: number;
  _idModulo: number;
  _idUser: number;
  dataInscricao: Date;
}

const InscricaoSchema: Schema = new mongoose.Schema({
  statusInscricao: { type: Number, required: true, default: 0 },
  _idModulo: { type: Number, required: true },
  _idUser: { type: Number, required: true },
  dataInscricao: { type: Date, default: Date.now }
});

export default mongoose.model<IInscricao>('Inscricao', InscricaoSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _idUser:
 *           type: number
 *         tipo:
 *           type: string
 *           enum: [administrador, aluno]
 *         nomeUsuario:
 *           type: string
 *         cpfUsuario:
 *           type: string
 *         senha:
 *           type: string
 *           format: password
 *         email:
 *           type: string
 *           format: email
 *         telefone:
 *           type: string
 *         endereco:
 *           type: object
 *           properties:
 *             rua:
 *               type: string
 *             numero:
 *               type: string
 *             bairro:
 *               type: string
 *             cidade:
 *               type: string
 *             estado:
 *               type: string
 *             pais:
 *               type: string
 *     Inscricao:
 *       type: object
 *       properties:
 *         statusInscricao:
 *           type: number
 *         _idModulo:
 *           type: number
 *         _idUser:
 *           type: number
 *         dataInscricao:
 *           type: string
 *           format: date-time
 */

