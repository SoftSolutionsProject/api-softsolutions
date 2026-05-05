import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';

describe('Integração: Usuário + Curso + Inscrição', () => {
  let usuarioRepo: UsuarioRepository;
  let cursoRepo: CursoRepository;
  let inscricaoRepo: InscricaoRepository;
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
    inscricaoRepo = moduleRef.get<InscricaoRepository>(InscricaoRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar usuário, curso e inscrever o usuário no curso', async () => {
    // Cria usuário
    const usuario = await usuarioRepo.create({
      nomeUsuario: 'teste',
      cpfUsuario: '12345678900',
      email: 'teste@teste.com',
      senha: '123',
      tipo: 'aluno',
      telefone: '11999999999',
    });

    // Cria curso
    const curso = await cursoRepo.create({
      nomeCurso: 'Curso Integração',
      tempoCurso: 10,
      descricaoCurta: 'desc curta',
      descricaoDetalhada: 'desc detalhada',
      professor: 'prof',
      categoria: 'cat',
      status: 'ativo',
      avaliacao: 5,
      imagemCurso: 'img.png',
      modulos: [],
    });

    // Inscreve usuário no curso
    const inscricao = await inscricaoRepo.create({
      usuario,
      curso,
      progressoAulas: [],
    });

    // Valida se a inscrição foi criada corretamente
    expect(usuario.id).toBeDefined();
    expect(curso.id).toBeDefined();
    const inscricaoEncontrada = await inscricaoRepo.findByUsuarioAndCurso(usuario.id!, curso.id!);
    expect(inscricaoEncontrada).toBeDefined();
    expect(inscricaoEncontrada!.usuario.id).toBe(usuario.id);
    expect(inscricaoEncontrada!.curso.id).toBe(curso.id);
  });
});
