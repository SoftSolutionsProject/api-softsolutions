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
