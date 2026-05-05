import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { AvaliacaoRepository } from '../../../infrastructure/database/repositories/avaliacao.repository';

describe('Integração: Avaliação de Curso', () => {
  let usuarioRepo: UsuarioRepository;
  let cursoRepo: CursoRepository;
  let avaliacaoRepo: AvaliacaoRepository;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        }),
        InfrastructureModule,
      ],
    }).compile();

    usuarioRepo = moduleRef.get<UsuarioRepository>(UsuarioRepository);
    cursoRepo = moduleRef.get<CursoRepository>(CursoRepository);
    avaliacaoRepo = moduleRef.get<AvaliacaoRepository>(AvaliacaoRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve registrar avaliação de curso por usuário', async () => {
    const usuario = await usuarioRepo.create({
      nomeUsuario: 'aluno2',
      cpfUsuario: '22222222222',
      email: 'aluno2@teste.com',
      senha: '123',
      tipo: 'aluno',
      telefone: '11999999999',
    });
    const curso = await cursoRepo.create({
      nomeCurso: 'Curso Avaliação',
      tempoCurso: 8,
      descricaoCurta: 'desc',
      descricaoDetalhada: 'detalhe',
      professor: 'prof',
      categoria: 'cat',
      status: 'ativo',
      avaliacao: 0,
      imagemCurso: 'img.png',
      modulos: [],
    });
    const avaliacao = await avaliacaoRepo.create({
      usuarioId: usuario.id!, // non-null assertion
      cursoId: curso.id!, // non-null assertion
      nota: 4.5,
      comentario: 'Ótimo curso!',
    });
    expect(avaliacao.usuario.id).toBe(usuario.id);
    expect(avaliacao.curso.id).toBe(curso.id);
    expect(avaliacao.nota).toBe(4.5);
    expect(avaliacao.comentario).toBe('Ótimo curso!');
  });
});
