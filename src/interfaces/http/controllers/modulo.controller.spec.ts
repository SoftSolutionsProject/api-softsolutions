import { Test, TestingModule } from '@nestjs/testing';
import { ModuloController } from './modulo.controller';
import { CreateModuloUseCase } from '../../../application/use-cases/modulo/create-modulo.use-case';
import { GetModuloByIdUseCase } from '../../../application/use-cases/modulo/get-modulo-by-id.use-case';
import { ListModuloUseCase } from '../../../application/use-cases/modulo/list-modulo.use-case';
import { UpdateModuloUseCase } from '../../../application/use-cases/modulo/update-modulo.use-case';
import { DeleteModuloUseCase } from '../../../application/use-cases/modulo/delete-modulo.use-case';

describe('ModuloController', () => {
  let controller: ModuloController;
  let createModulo: jest.Mocked<CreateModuloUseCase>;
  let getModuloById: jest.Mocked<GetModuloByIdUseCase>;
  let listModulo: jest.Mocked<ListModuloUseCase>;
  let updateModulo: jest.Mocked<UpdateModuloUseCase>;
  let deleteModulo: jest.Mocked<DeleteModuloUseCase>;

  const moduloMock = {
    id: 1,
    nomeModulo: 'Modulo Teste',
    tempoModulo: 100,
    curso: { id: 1 }
  };

  beforeEach(async () => {
    createModulo = { execute: jest.fn() } as any;
    getModuloById = { execute: jest.fn() } as any;
    listModulo = { execute: jest.fn() } as any;
    updateModulo = { execute: jest.fn() } as any;
    deleteModulo = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuloController],
      providers: [
        { provide: CreateModuloUseCase, useValue: createModulo },
        { provide: GetModuloByIdUseCase, useValue: getModuloById },
        { provide: ListModuloUseCase, useValue: listModulo },
        { provide: UpdateModuloUseCase, useValue: updateModulo },
        { provide: DeleteModuloUseCase, useValue: deleteModulo },
      ],
    }).compile();

    controller = module.get<ModuloController>(ModuloController);
  });

  it('deve criar módulo se admin', async () => {
    createModulo.execute.mockResolvedValue(moduloMock);
    const result = await controller.create({} as any, 'administrador');
    expect(result).toHaveProperty('id');
  });

  it('deve negar criação se não admin', async () => {
    await expect(controller.create({} as any, 'aluno')).rejects.toThrowError();
  });

  it('deve listar todos os módulos', async () => {
    listModulo.execute.mockResolvedValue([moduloMock]);
    const result = await controller.findAll();
    expect(result[0]).toHaveProperty('id');
  });

  it('deve buscar módulo por ID', async () => {
    getModuloById.execute.mockResolvedValue(moduloMock);
    const result = await controller.findOne('1');
    expect(result).toHaveProperty('id');
  });

  it('deve atualizar módulo se admin', async () => {
    updateModulo.execute.mockResolvedValue(moduloMock);
    const result = await controller.update('1', {} as any, 'administrador');
    expect(result).toHaveProperty('id');
  });

  it('deve negar update se não admin', async () => {
    await expect(controller.update('1', {} as any, 'aluno')).rejects.toThrowError();
  });

  it('deve remover módulo se admin', async () => {
    deleteModulo.execute.mockResolvedValue({ message: 'ok' });
    const result = await controller.remove('1', 'administrador');
    expect(result).toEqual({ message: 'ok' });
  });

  it('deve negar remover se não admin', async () => {
    await expect(controller.remove('1', 'aluno')).rejects.toThrowError();
  });
});
