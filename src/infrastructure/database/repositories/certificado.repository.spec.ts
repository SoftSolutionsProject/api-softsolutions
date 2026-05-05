import { Test, TestingModule } from '@nestjs/testing';
import { CertificadoRepository } from './certificado.repository';
import { Repository } from 'typeorm';
import { CertificadoEntity } from '../entities/certificado.entity';
import { UsuarioRepository } from './usuario.repository';
import { CursoRepository } from './curso.repository';

const mockUsuarioRepo = { findById: jest.fn() };
const mockCursoRepo = { findById: jest.fn() };
const mockRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };

describe('CertificadoRepository', () => {
  let repo: CertificadoRepository;

  beforeEach(() => {
    repo = new CertificadoRepository(
      mockRepo as any,
      mockUsuarioRepo as any,
      mockCursoRepo as any,
    );
    jest.clearAllMocks();
  });

  it('deve lançar erro se usuario não informado', async () => {
    await expect(repo.create({ curso: { id: 1 } } as any)).rejects.toThrow('Usuário não informado ou sem ID');
  });

  it('deve lançar erro se curso não informado', async () => {
    await expect(repo.create({ usuario: { id: 1 } } as any)).rejects.toThrow('Curso não informado ou sem ID');
  });

  it('deve criar certificado corretamente', async () => {
    mockUsuarioRepo.findById.mockResolvedValue({ id: 1 });
    mockCursoRepo.findById.mockResolvedValue({ id: 2 });
    mockRepo.create.mockReturnValue({});
    mockRepo.save.mockResolvedValue({ id: 123 });
    const data = { usuario: { id: 1 }, curso: { id: 2 }, numeroSerie: 'abc', dataEmissao: '2024-01-01' };
    const result = await repo.create(data as any);
    expect(result).toHaveProperty('id', 123);
  });

  it('deve buscar por numero de série', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    const result = await repo.findByNumeroSerie('abc');
    expect(result).toHaveProperty('id', 1);
  });

  it('deve buscar por inscrição', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 2 });
    const inscricao = { usuario: { id: 1 }, curso: { id: 2 } };
    const result = await repo.findByInscricao(inscricao as any);
    expect(result).toHaveProperty('id', 2);
  });
});
