import { InscreverUsuarioUseCase } from './inscrever-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InscreverUsuarioUseCase', () => {
  let useCase: InscreverUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;
  let cursoRepo: jest.Mocked<CursoRepository>;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let progressoRepo: jest.Mocked<ProgressoAulaRepository>;
  let aulaRepo: jest.Mocked<AulaRepository>;

 const usuarioMock = {
  id: 1,
  nomeUsuario: 'João',
  cpfUsuario: '12345678900',
  email: 'joao@email.com',
  senha: 'senha123',
  tipo: 'aluno'
} as const;

const cursoMock = {
  id: 1,
  nomeCurso: 'Curso Teste',
  tempoCurso: 120,
  descricaoCurta: 'Descrição curta',
  descricaoDetalhada: 'Descrição detalhada',
  imagemCurso: 'imagem.jpg',
  categoria: 'Categoria Teste',
  status: 'ativo' as 'ativo',
  professor: 'Professor Teste',
  avaliacao: 4.5,
  modulos: [
    {
      id: 1,
      nomeModulo: 'Modulo Teste',
      tempoModulo: 60,
      curso: {} as any,
      aulas: [
        {
          id: 1,
          nomeAula: 'Aula Fake',
          tempoAula: 10,
          videoUrl: 'http://fake.url/video',
          descricaoConteudo: 'Descrição fake',
          modulo: {} as any
        }
      ]
    }
  ]
};



const inscricaoMock = {
  id: 1,
  status: 'ativo' as 'ativo', // CORRETO AGORA!
  dataInscricao: new Date(),
  usuario: usuarioMock,
  curso: cursoMock
};

  beforeEach(() => {
    usuarioRepo = { findById: jest.fn() } as any;
    cursoRepo = { findByIdWithModulosAndAulas: jest.fn() } as any;
    inscricaoRepo = {
      findByUsuarioAndCurso: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    } as any;
    progressoRepo = {
      createMany: jest.fn()
    } as any;
    aulaRepo = {} as any;

    useCase = new InscreverUsuarioUseCase(
      usuarioRepo,
      cursoRepo,
      inscricaoRepo,
      progressoRepo,
      aulaRepo
    );
  });

  it('deve inscrever o usuário com sucesso', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    inscricaoRepo.create.mockResolvedValue(inscricaoMock as any);

    const result = await useCase.execute(1, 1);
    expect(result).toHaveProperty('id');
    expect(inscricaoRepo.create).toHaveBeenCalled();
    expect(progressoRepo.createMany).toHaveBeenCalled();
  });

 it('deve reativar inscrição cancelada', async () => {
  usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
  cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
  inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({
    ...inscricaoMock,
    status: 'cancelado'
  });
  inscricaoRepo.update.mockResolvedValue(inscricaoMock as any);

  const result = await useCase.execute(1, 1);
  expect(result).toHaveProperty('id');
  expect(inscricaoRepo.update).toHaveBeenCalled();
});

  it('deve lançar erro se inscrição já existir e não estiver cancelada', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({
      ...inscricaoMock,
      status: 'ativo'
    });

    await expect(useCase.execute(1, 1)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException se curso não for encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(null);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar NotFoundException se usuário não for encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });
});
