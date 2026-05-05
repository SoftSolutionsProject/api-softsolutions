import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';

describe('Integração: Curso + Módulo + Aula', () => {
  let cursoRepo: CursoRepository;
  let moduloRepo: ModuloRepository;
  let aulaRepo: AulaRepository;
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

    cursoRepo = moduleRef.get<CursoRepository>(CursoRepository);
    moduloRepo = moduleRef.get<ModuloRepository>(ModuloRepository);
    aulaRepo = moduleRef.get<AulaRepository>(AulaRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar curso, módulo e aula vinculados', async () => {
    // Cria curso
    const curso = await cursoRepo.create({
      nomeCurso: 'Curso Integração',
      tempoCurso: 20,
      descricaoCurta: 'desc curta',
      descricaoDetalhada: 'desc detalhada',
      professor: 'prof',
      categoria: 'cat',
      status: 'ativo',
      avaliacao: 5,
      imagemCurso: 'img.png',
      modulos: [],
    });

    // Cria módulo vinculado ao curso
    const modulo = await moduloRepo.create({
      nomeModulo: 'Módulo 1',
      tempoModulo: 10,
      curso,
      aulas: [],
    });

    // Cria aula vinculada ao módulo
    const aula = await aulaRepo.create({
      nomeAula: 'Aula 1',
      tempoAula: 60,
      videoUrl: 'https://youtube.com/aula1',
      descricaoConteudo: 'Conteúdo da aula',
      modulo,
      materialApoio: ['slide.pdf'],
    });

    // Valida vínculos
    expect(aula.modulo.id).toBe(modulo.id);
    expect(modulo.curso.id).toBe(curso.id);
  });
});
