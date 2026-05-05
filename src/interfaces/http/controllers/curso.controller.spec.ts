import { Test, TestingModule } from '@nestjs/testing';
import { CursoController } from './curso.controller';
import { CreateCursoUseCase } from '../../../application/use-cases/curso/create-curso.use-case';
import { GetCursoByIdUseCase } from '../../../application/use-cases/curso/get-curso-by-id.use-case';
import { ListCursoUseCase } from '../../../application/use-cases/curso/list-curso.use-case';
import { UpdateCursoUseCase } from '../../../application/use-cases/curso/update-curso.use-case';
import { DeleteCursoUseCase } from '../../../application/use-cases/curso/delete-curso.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CursoModel } from '../../../domain/models/curso.model';

const cursoMock: CursoModel = {
  id: 1,
  nomeCurso: 'Curso Teste',
  tempoCurso: 40,
  descricaoCurta: 'Descricao curta',
  descricaoDetalhada: 'Descricao detalhada',
  professor: 'Professor X',
  categoria: 'Categoria Y',
  status: 'ativo',
  avaliacao: 5,
  imagemCurso: 'url',
  modulos: [],
};

describe('CursoController', () => {
  let controller: CursoController;
  let createCurso: jest.Mocked<CreateCursoUseCase>;
  let getCursoById: jest.Mocked<GetCursoByIdUseCase>;
  let listCurso: jest.Mocked<ListCursoUseCase>;
  let updateCurso: jest.Mocked<UpdateCursoUseCase>;
  let deleteCurso: jest.Mocked<DeleteCursoUseCase>;
  let cursoRepo: jest.Mocked<CursoRepository>;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;

  beforeEach(async () => {
    createCurso = { execute: jest.fn() } as any;
    getCursoById = { execute: jest.fn() } as any;
    listCurso = { execute: jest.fn() } as any;
    updateCurso = { execute: jest.fn() } as any;
    deleteCurso = { execute: jest.fn() } as any;
    cursoRepo = {
      findByIdWithModulosAndAulas: jest.fn(),
      findById: jest.fn(),
    } as any;
    inscricaoRepo = {
      findByUsuarioAndCurso: jest.fn(),
      countByCurso: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursoController],
      providers: [
        { provide: CreateCursoUseCase, useValue: createCurso },
        { provide: GetCursoByIdUseCase, useValue: getCursoById },
        { provide: ListCursoUseCase, useValue: listCurso },
        { provide: UpdateCursoUseCase, useValue: updateCurso },
        { provide: DeleteCursoUseCase, useValue: deleteCurso },
        { provide: CursoRepository, useValue: cursoRepo },
        { provide: InscricaoRepository, useValue: inscricaoRepo },
      ],
    }).compile();

    controller = module.get<CursoController>(CursoController);
  });

  it('deve criar curso se admin', async () => {
    createCurso.execute.mockResolvedValue(cursoMock);

    const result = await controller.create({} as any, 'administrador');

    expect(createCurso.execute).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  it('deve negar criação se não admin', async () => {
    await expect(controller.create({} as any, 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve listar cursos', async () => {
    listCurso.execute.mockResolvedValue([cursoMock]);

    const result = await controller.list();

    expect(result[0]).toHaveProperty('id');
  });

  it('deve obter curso por id e validar id inválido', async () => {
    getCursoById.execute.mockResolvedValue(cursoMock);

    await expect(controller.getById('1')).resolves.toHaveProperty('id');
    await expect(controller.getById('abc')).rejects.toThrow(ForbiddenException);
  });

  it('deve atualizar curso se admin e barrar id inválido', async () => {
    updateCurso.execute.mockResolvedValue(cursoMock);

    await expect(controller.update('1', {} as any, 'administrador')).resolves.toHaveProperty(
      'id',
    );
    await expect(
      controller.update('abc', {} as any, 'administrador'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve negar update se não admin', async () => {
    await expect(controller.update('1', {} as any, 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve deletar curso se admin e barrar id inválido', async () => {
    deleteCurso.execute.mockResolvedValue({ message: 'ok' });

    await expect(controller.delete('1', 'administrador')).resolves.toEqual({
      message: 'ok',
    });
    await expect(controller.delete('abc', 'administrador')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve negar delete se não admin', async () => {
    await expect(controller.delete('1', 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve retornar módulos se usuário estiver inscrito', async () => {
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({ status: 'ativo' } as any);

    await expect(controller.getModulosEAulas('1', 1)).resolves.toEqual([]);
  });

  it('deve validar id e curso em getModulosEAulas', async () => {
    await expect(controller.getModulosEAulas('abc', 1)).rejects.toThrow(
      ForbiddenException,
    );

    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(null);
    await expect(controller.getModulosEAulas('1', 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve negar módulos se inscrição não existir ou não estiver ativa', async () => {
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    await expect(controller.getModulosEAulas('1', 1)).rejects.toThrow(
      ForbiddenException,
    );

    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({ status: 'cancelado' } as any);
    await expect(controller.getModulosEAulas('1', 1)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve retornar quantidade de inscritos e validar erros', async () => {
    cursoRepo.findById.mockResolvedValue(cursoMock as any);
    inscricaoRepo.countByCurso.mockResolvedValue(9);

    await expect(controller.getQuantidadeInscritos('1')).resolves.toEqual({
      quantidadeInscritos: 9,
    });
    await expect(controller.getQuantidadeInscritos('abc')).rejects.toThrow(
      ForbiddenException,
    );

    cursoRepo.findById.mockResolvedValue(null);
    await expect(controller.getQuantidadeInscritos('1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
