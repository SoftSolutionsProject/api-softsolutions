import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  _idUser: number;
  tipo: 'administrador' | 'aluno';
  nomeUsuario: string;
  cpfUsuario: string;
  senha: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

const UsuarioSchema: Schema = new mongoose.Schema({
  _idUser: { type: Number, required: true, unique: true },
  tipo: { type: String, enum: ['administrador', 'aluno'], required: true, default: 'aluno' },
  nomeUsuario: { type: String, required: true, index: true },
  cpfUsuario: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String },
  endereco: {
    rua: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String },
    pais: { type: String },
  },
  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
});


export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);


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
