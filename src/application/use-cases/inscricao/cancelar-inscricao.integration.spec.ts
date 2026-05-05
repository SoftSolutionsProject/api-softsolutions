import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';

describe('Integração: Cancelamento de Inscrição', () => {
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

  it('deve cancelar inscrição de usuário em curso', async () => {
    const usuario = await usuarioRepo.create({
      nomeUsuario: 'aluno4',
      cpfUsuario: '44444444444',
      email: 'aluno4@teste.com',
      senha: '123',
      tipo: 'aluno',
      telefone: '11999999999',
    });
    const curso = await cursoRepo.create({
      nomeCurso: 'Curso Cancelamento',
      tempoCurso: 6,
      descricaoCurta: 'desc',
      descricaoDetalhada: 'detalhe',
      professor: 'prof',
      categoria: 'cat',
      status: 'ativo',
      avaliacao: 0,
      imagemCurso: 'img.png',
      modulos: [],
    });
    const inscricao = await inscricaoRepo.create({
      usuario,
      curso,
      progressoAulas: [],
    });
    // Cancela inscrição
    await inscricaoRepo.update(inscricao.id!, { status: 'cancelado' });
    const inscricaoAtualizada = await inscricaoRepo.findById(inscricao.id!);
    expect(inscricaoAtualizada!.status).toBe('cancelado');
  });
});
