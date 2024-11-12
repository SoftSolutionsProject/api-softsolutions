import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  _idUser: number;
  tipo: 'administrador' | 'aluno';
  nomeUsuario: string;
  cpfUsuario: number;
  senha: string;
  email: string;
  telefone?: string;
}

const UsuarioSchema: Schema = new mongoose.Schema({
  _idUser: { type: Number, required: true, unique: true },
  tipo: { type: String, enum: ['administrador', 'aluno'], required: true },
  nomeUsuario: { type: String, required: true },
  cpfUsuario: { type: Number, required: true, unique: true },
  senha: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: String,
});

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);
