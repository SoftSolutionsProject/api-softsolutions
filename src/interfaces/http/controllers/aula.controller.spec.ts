import { Test, TestingModule } from '@nestjs/testing';
import { AulaController } from './aula.controller';
import { CreateAulaUseCase } from '../../../application/use-cases/aula/create-aula.use-case';
import { DeleteAulaUseCase } from '../../../application/use-cases/aula/delete-aula.use-case';
import { GetAulaByIdUseCase } from '../../../application/use-cases/aula/get-aula-by-id.use-case';
import { ListAulaUseCase } from '../../../application/use-cases/aula/list-aula.use-case';
import { UpdateAulaUseCase } from '../../../application/use-cases/aula/update-aula.use-case';
import { ListAulaByModuloUseCase } from '../../../application/use-cases/aula/list-aula-by-modulo.use-case';
import { ListAulaByCursoUseCase } from '../../../application/use-cases/aula/list-aula-by-curso.use-case';
import { ForbiddenException } from '@nestjs/common';

describe('AulaController', () => {
  let controller: AulaController;
  let createAula: jest.Mocked<CreateAulaUseCase>;
  let deleteAula: jest.Mocked<DeleteAulaUseCase>;
  let getAulaById: jest.Mocked<GetAulaByIdUseCase>;
  let listAula: jest.Mocked<ListAulaUseCase>;
  let updateAula: jest.Mocked<UpdateAulaUseCase>;
  let listAulaByModulo: jest.Mocked<ListAulaByModuloUseCase>;
  let listAulaByCurso: jest.Mocked<ListAulaByCursoUseCase>;

  const aulaMock = {
  id: 1,
  nomeAula: 'Aula Teste',
  tempoAula: 30,
  videoUrl: 'url',
  descricaoConteudo: 'descricao',
  materialApoio: [],
  modulo: {
    id: 1,
    nomeModulo: 'Modulo Teste',
    tempoModulo: 100,
    curso: {
      id: 1,
      nomeCurso: 'Curso Teste',
      tempoCurso: 100,
      descricaoCurta: 'descricao',
      descricaoDetalhada: 'detalhada',
      professor: 'professor',
      categoria: 'categoria',
      status: 'ativo',
      avaliacao: 5,
      imagemCurso: 'url'
    }
  }
};


  beforeEach(async () => {
    createAula = { execute: jest.fn() } as any;
    deleteAula = { execute: jest.fn() } as any;
    getAulaById = { execute: jest.fn() } as any;
    listAula = { execute: jest.fn() } as any;
    updateAula = { execute: jest.fn() } as any;
    listAulaByModulo = { execute: jest.fn() } as any;
    listAulaByCurso = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AulaController],
      providers: [
        { provide: CreateAulaUseCase, useValue: createAula },
        { provide: DeleteAulaUseCase, useValue: deleteAula },
        { provide: GetAulaByIdUseCase, useValue: getAulaById },
        { provide: ListAulaUseCase, useValue: listAula },
        { provide: UpdateAulaUseCase, useValue: updateAula },
        { provide: ListAulaByModuloUseCase, useValue: listAulaByModulo },
        { provide: ListAulaByCursoUseCase, useValue: listAulaByCurso },
      ],
    }).compile();

    controller = module.get<AulaController>(AulaController);
  });

  it('deve criar aula se admin', async () => {
    createAula.execute.mockResolvedValue(aulaMock);
    const result = await controller.create({} as any, 'administrador');
    expect(result).toHaveProperty('id');
  });

  it('deve negar criação se não admin', async () => {
    await expect(controller.create({} as any, 'aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve listar todas as aulas', async () => {
    listAula.execute.mockResolvedValue([aulaMock]);
    const result = await controller.list();
    expect(result[0]).toHaveProperty('id');
  });

  it('deve obter aula por id', async () => {
    getAulaById.execute.mockResolvedValue(aulaMock);
    const result = await controller.getById('1');
    expect(result).toHaveProperty('id');
  });

  it('deve atualizar aula se admin', async () => {
    updateAula.execute.mockResolvedValue(aulaMock);
    const result = await controller.update('1', {} as any, 'administrador');
    expect(result).toHaveProperty('id');
  });

  it('deve negar update se não admin', async () => {
    await expect(controller.update('1', {} as any, 'aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve deletar aula se admin', async () => {
    deleteAula.execute.mockResolvedValue({ message: 'ok' });
    const result = await controller.delete('1', 'administrador');
    expect(result).toEqual({ message: 'ok' });
  });

  it('deve negar delete se não admin', async () => {
    await expect(controller.delete('1', 'aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve listar aulas por módulo', async () => {
    listAulaByModulo.execute.mockResolvedValue([aulaMock]);
    const result = await controller.listByModulo('1');
    expect(result[0]).toHaveProperty('id');
  });

  it('deve listar aulas por curso', async () => {
    listAulaByCurso.execute.mockResolvedValue([aulaMock]);
    const result = await controller.listByCurso('1');
    expect(result[0]).toHaveProperty('id');
  });
});
