import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { CertificadoRepository } from '../../../infrastructure/database/repositories/certificado.repository';

describe('Integração: Emissão de Certificado', () => {
  let usuarioRepo: UsuarioRepository;
  let cursoRepo: CursoRepository;
  let certificadoRepo: CertificadoRepository;
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
    certificadoRepo = moduleRef.get<CertificadoRepository>(CertificadoRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve emitir certificado para usuário inscrito em curso', async () => {
    const usuario = await usuarioRepo.create({
      nomeUsuario: 'aluno3',
      cpfUsuario: '33333333333',
      email: 'aluno3@teste.com',
      senha: '123',
      tipo: 'aluno',
      telefone: '11999999999',
    });
    const curso = await cursoRepo.create({
      nomeCurso: 'Curso Certificado',
      tempoCurso: 12,
      descricaoCurta: 'desc',
      descricaoDetalhada: 'detalhe',
      professor: 'prof',
      categoria: 'cat',
      status: 'ativo',
      avaliacao: 0,
      imagemCurso: 'img.png',
      modulos: [],
    });
    const certificado = await certificadoRepo.create({
      numeroSerie: 'CERT123',
      usuario,
      curso,
      dataEmissao: new Date(),
    });
    expect(certificado.usuario.id).toBe(usuario.id);
    expect(certificado.curso.id).toBe(curso.id);
    expect(certificado.numeroSerie).toBe('CERT123');
    expect(certificado.dataEmissao).toBeInstanceOf(Date);
  });
});
