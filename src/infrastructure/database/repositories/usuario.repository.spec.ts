import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioRepository } from './usuario.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioEntity } from '../entities/usuario.entity';

const mockUsuario = {
  id: 1,
  email: 'test@email.com',
  cpfUsuario: '12345678900',
};

describe('UsuarioRepository', () => {
  let repository: UsuarioRepository;
  let repo: Repository<UsuarioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioRepository,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockUsuario),
            save: jest.fn().mockResolvedValue(mockUsuario),
            findOne: jest.fn().mockResolvedValue(mockUsuario),
            find: jest.fn().mockResolvedValue([mockUsuario]),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    repository = module.get<UsuarioRepository>(UsuarioRepository);
    repo = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
  });

  it('deve criar um usuário', async () => {
    const result = await repository.create(mockUsuario);
    expect(repo.create).toHaveBeenCalledWith(mockUsuario);
    expect(repo.save).toHaveBeenCalledWith(mockUsuario);
    expect(result).toEqual(mockUsuario);
  });

  it('deve buscar por email', async () => {
    const result = await repository.findByEmail('test@email.com');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@email.com' } });
    expect(result).toEqual(mockUsuario);
  });

  it('deve buscar por cpf', async () => {
    const result = await repository.findByCpf('12345678900');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { cpfUsuario: '12345678900' } });
    expect(result).toEqual(mockUsuario);
  });

  it('deve buscar por id', async () => {
    const result = await repository.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockUsuario);
  });

  it('deve buscar todos', async () => {
    const result = await repository.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockUsuario]);
  });

  it('deve atualizar um usuário', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockUsuario as any);
    const result = await repository.update(1, { email: 'novo@email.com' });
    expect(repo.update).toHaveBeenCalledWith(1, { email: 'novo@email.com' });
    expect(result).toEqual(mockUsuario);
  });

  it('deve deletar um usuário', async () => {
    await repository.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
