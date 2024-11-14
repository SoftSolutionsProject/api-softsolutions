import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  _idUser: number;
  tipo: 'administrador' | 'aluno';
  nomeUsuario: string;
  cpfUsuario: number;
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
  tipo: { type: String, enum: ['administrador', 'aluno'], required: true },
  nomeUsuario: { type: String, required: true, index: true },
  cpfUsuario: { type: Number, required: true, unique: true },
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
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
});

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);
