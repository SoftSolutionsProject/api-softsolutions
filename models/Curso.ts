import mongoose, { Schema, Document } from 'mongoose';

export interface IAula {
  _idAula: number;
  nomeAula: string;
  tempoAula: number; // Em horas
  videoUrl: string;
  materialApoio: string[]; // Links para materiais
  descricaoConteudo: string;
}

export interface IModulo {
  _idModulo: number;
  nomeModulo: string;
  tempoModulo: number; // Em horas
  aulas: IAula[];
}

export interface ICurso extends Document {
  _idCurso: number;
  nomeCurso: string;
  tempoCurso: number; // Em horas
  descricaoCurta: string;
  descricaoDetalhada: string;
  professor: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  avaliacao: number;
  imagemCurso:string;
  modulos: IModulo[];
}

const AulaSchema = new Schema<IAula>({
  _idAula: { type: Number, required: true },
  nomeAula: { type: String, required: true },
  tempoAula: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  materialApoio: { type: [String], default: [] },
  descricaoConteudo: { type: String, required: true },
});

const ModuloSchema = new Schema<IModulo>({
  _idModulo: { type: Number, required: true },
  nomeModulo: { type: String, required: true },
  tempoModulo: { type: Number, required: true },
  aulas: { type: [AulaSchema], required: true },
});

const CursoSchema = new Schema<ICurso>({
  _idCurso: { type: Number, required: true, unique: true },
  nomeCurso: { type: String, required: true },
  tempoCurso: { type: Number, required: true },
  descricaoCurta: { type: String, required: true },
  descricaoDetalhada: { type: String, required: true },
  professor: { type: String, required: true },
  categoria: { type: String, required: true },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  avaliacao: { type: Number, default: 0 },
  imagemCurso: { type: String, required: true },
  modulos: { type: [ModuloSchema], required: true },
});

export default mongoose.model<ICurso>('Curso', CursoSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       properties:
 *         _idCurso:
 *           type: number
 *           description: ID único do curso
 *         nomeCurso:
 *           type: string
 *           description: Nome do curso
 *         tempoCurso:
 *           type: number
 *           description: Duração total do curso em horas
 *         descricaoCurta:
 *           type: string
 *           description: Descrição curta do curso
 *         descricaoDetalhada:
 *           type: string
 *           description: Descrição detalhada do curso
 *         professor:
 *           type: string
 *           description: Nome do professor
 *         categoria:
 *           type: string
 *           description: Categoria do curso
 *         status:
 *           type: string
 *           enum: [ativo, inativo]
 *           description: Status do curso
 *         avaliacao:
 *           type: number
 *           description: Avaliação do curso
 *         imagemCurso:
 *           type: string
 *           description: URL da imagem representando o curso
 *         modulos:
 *           type: array
 *           description: Lista de módulos do curso
 *           items:
 *             type: object
 *             properties:
 *               _idModulo:
 *                 type: number
 *                 description: ID único do módulo
 *               nomeModulo:
 *                 type: string
 *                 description: Nome do módulo
 *               tempoModulo:
 *                 type: number
 *                 description: Duração total do módulo em horas
 *               aulas:
 *                 type: array
 *                 description: Lista de aulas do módulo
 *                 items:
 *                   type: object
 *                   properties:
 *                     _idAula:
 *                       type: number
 *                       description: ID único da aula
 *                     nomeAula:
 *                       type: string
 *                       description: Nome da aula
 *                     tempoAula:
 *                       type: number
 *                       description: Duração da aula em horas
 *                     videoUrl:
 *                       type: string
 *                       description: URL do vídeo da aula
 *                     materialApoio:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Links para materiais de apoio
 *                     descricaoConteudo:
 *                       type: string
 *                       description: Descrição do conteúdo da aula
 */
