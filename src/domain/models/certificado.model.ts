// src/domain/models/certificado.model.ts
import { UsuarioModel } from './usuario.model';
import { CursoModel } from './curso.model';

export interface CertificadoModel {
  id?: number;
  numeroSerie: string;
  usuario: UsuarioModel;
  curso: CursoModel;
  dataEmissao: Date;
  urlPdf?: string;
}
