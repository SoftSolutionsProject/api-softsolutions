import { DataSource } from 'typeorm';
import ormConfig from '../../ormconfig.migration';
import { CursoEntity } from 'src/infrastructure/database/entities/curso.entity';
import { ModuloEntity } from 'src/infrastructure/database/entities/modulo.entity';
import { AulaEntity } from 'src/infrastructure/database/entities/aula.entity';

interface AulaSeed {
  nomeAula: string;
  tempoAula: number;
  descricaoConteudo: string;
  materialApoio?: string[];
  videoUrl?: string;
}

interface ModuloSeed {
  nomeModulo: string;
  tempoModulo: number;
  aulas: AulaSeed[];
}

interface CursoSeed {
  curso: Omit<CursoEntity, 'id' | 'modulos' | 'inscricoes'>;
  modulos: ModuloSeed[];
}

const defaultMaterial = ['https://softsolutions.com.br/material/busca-semantica.pdf'];
const defaultVideo = 'https://www.youtube.com/embed/QGBkp-pvTi4?si=kwPdbIrkOMtf1ZXs';

const semanticCourses: CursoSeed[] = [
  {
    curso: {
      nomeCurso: 'Segurança em APIs com NestJS',
      tempoCurso: 36,
      descricaoCurta: 'Aprenda a proteger APIs HTTP usando autenticação moderna.',
      descricaoDetalhada:
        'Curso prático cobrindo conceitos de autenticação, autorização e uso de JWT para login seguro em APIs NestJS.',
      professor: 'Ana Souza',
      categoria: 'Backend',
      status: 'ativo',
      avaliacao: 4.9,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/security-api.png',
    },
    modulos: [
      {
        nomeModulo: 'Fundamentos de Autenticação e Login',
        tempoModulo: 12,
        aulas: [
          {
            nomeAula: 'Fluxo de Login Tradicional x Login com Tokens',
            tempoAula: 6,
            descricaoConteudo:
              'Compara sessões baseadas em cookies com autenticação via token e apresenta riscos comuns no processo de login.',
          },
          {
            nomeAula: 'Mapeando Intenções de Usuário em Processos de Login',
            tempoAula: 6,
            descricaoConteudo:
              'Mostra como o backend lida com intents como “quero acessar minha conta” ou “preciso redefinir minha senha”.',
          },
        ],
      },
      {
        nomeModulo: 'Implementando JWT no NestJS',
        tempoModulo: 12,
        aulas: [
          {
            nomeAula: 'Gerando tokens JWT com Passport',
            tempoAula: 6,
            descricaoConteudo:
              'Passo a passo para gerar JSON Web Tokens, incluindo assinatura, expiração, refresh e boas práticas de segurança.',
          },
          {
            nomeAula: 'Protegendo rotas e guards de autorização',
            tempoAula: 6,
            descricaoConteudo:
              'Demonstra guards personalizados, validação de escopos e associação com regras de segurança.',
          },
        ],
      },
      {
        nomeModulo: 'Observabilidade e monitoramento de segurança',
        tempoModulo: 12,
        aulas: [
          {
            nomeAula: 'Auditoria de tentativas de login',
            tempoAula: 6,
            descricaoConteudo:
              'Explica como armazenar logs de login e detectar anomalias como brute force e credenciais vazadas.',
          },
          {
            nomeAula: 'Alertas sobre tokens comprometidos',
            tempoAula: 6,
            descricaoConteudo:
              'Mostra como invalidar tokens em caso de roubo e comunicar o usuário sobre incidentes.',
          },
        ],
      },
    ],
  },
  {
    curso: {
      nomeCurso: 'Arquiteturas Zero Trust e Segurança de Serviços',
      tempoCurso: 30,
      descricaoCurta: 'Introdução prática ao modelo Zero Trust aplicado a microsserviços.',
      descricaoDetalhada:
        'Explora princípios Zero Trust, segmentação, políticas mínimas e monitoramento de tráfego para proteger APIs e eventos.',
      professor: 'Rafael Castro',
      categoria: 'Segurança',
      status: 'ativo',
      avaliacao: 4.8,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/zero-trust.png',
    },
    modulos: [
      {
        nomeModulo: 'Princípios de Segurança Zero Trust',
        tempoModulo: 10,
        aulas: [
          {
            nomeAula: 'Nunca confie, sempre valide',
            tempoAula: 5,
            descricaoConteudo:
              'Define Zero Trust e mostra porque segurança baseada em perímetro não atende mais ao cenário atual.',
          },
          {
            nomeAula: 'Classificação de ativos e superfícies de ataque',
            tempoAula: 5,
            descricaoConteudo:
              'Apresenta técnicas para mapear APIs críticas, priorizar defesas e relacionar com temas de segurança.',
          },
        ],
      },
      {
        nomeModulo: 'Autenticação Contínua e Contextual',
        tempoModulo: 10,
        aulas: [
          {
            nomeAula: 'Score dinâmico de risco em tentativas de login',
            tempoAula: 5,
            descricaoConteudo:
              'Relaciona login suspeito a fatores como IP, horário e comportamento anterior.',
          },
          {
            nomeAula: 'Uso de MFA e validação de dispositivos',
            tempoAula: 5,
            descricaoConteudo:
              'Integração com MFA e políticas baseadas em dispositivo para reforçar segurança.',
          },
        ],
      },
      {
        nomeModulo: 'Resposta a incidentes e automação',
        tempoModulo: 10,
        aulas: [
          {
            nomeAula: 'Playbooks para vazamento de tokens JWT',
            tempoAula: 5,
            descricaoConteudo:
              'Explica o passo a passo quando um token é comprometido e precisa ser revogado rapidamente.',
          },
          {
            nomeAula: 'Automação com webhooks e SIEM',
            tempoAula: 5,
            descricaoConteudo:
              'Integra logs de segurança ao SIEM para alertar automaticamente sobre violações.',
          },
        ],
      },
    ],
  },
  {
    curso: {
      nomeCurso: 'Identidade e Acesso em Microsserviços',
      tempoCurso: 28,
      descricaoCurta: 'Construa provedores de identidade e fluxos de login consistentes.',
      descricaoDetalhada:
        'Curso focado em OpenID Connect, OAuth2, gestão de credenciais e políticas de segurança entre microsserviços.',
      professor: 'Camila Prado',
      categoria: 'Arquitetura',
      status: 'ativo',
      avaliacao: 4.7,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/identity.png',
    },
    modulos: [
      {
        nomeModulo: 'Design de provedores de login',
        tempoModulo: 9,
        aulas: [
          {
            nomeAula: 'Modelando fluxo de autenticação entre serviços',
            tempoAula: 4,
            descricaoConteudo:
              'Como sincronizar login entre portais e APIs, lidando com múltiplas intenções do usuário.',
          },
          {
            nomeAula: 'Armazenamento seguro de senhas e secrets',
            tempoAula: 5,
            descricaoConteudo:
              'Demonstra hash seguro, rotation de secrets e segregação de responsabilidades.',
          },
        ],
      },
      {
        nomeModulo: 'Tokens, escopos e delegação',
        tempoModulo: 9,
        aulas: [
          {
            nomeAula: 'JWT vs. PASETO: quando usar cada um',
            tempoAula: 4,
            descricaoConteudo:
              'Analisa vantagens e riscos de cada formato de token em ambientes distribuídos.',
          },
          {
            nomeAula: 'Implicações de segurança em escopos OAuth',
            tempoAula: 5,
            descricaoConteudo:
              'Explica por que “segurança” vai além do token e envolve concessões mínimas.',
          },
        ],
      },
      {
        nomeModulo: 'Auditoria e governança de acesso',
        tempoModulo: 10,
        aulas: [
          {
            nomeAula: 'Relatórios de login e trilhas de auditoria',
            tempoAula: 5,
            descricaoConteudo:
              'Como evidenciar tentativas de login, aprovações, negações e incidentes.',
          },
          {
            nomeAula: 'Políticas de segurança em ambientes regulados',
            tempoAula: 5,
            descricaoConteudo:
              'Relaciona requisitos de segurança a normas como LGPD e ISO 27001.',
          },
        ],
      },
    ],
  },
];

export async function runSeedBuscaSemantica() {
  const dataSource: DataSource = ormConfig;
  await dataSource.initialize();

  try {
    const cursoRepo = dataSource.getRepository(CursoEntity);
    const moduloRepo = dataSource.getRepository(ModuloEntity);
    const aulaRepo = dataSource.getRepository(AulaEntity);

    for (const seed of semanticCourses) {
      const existing = await cursoRepo.findOne({ where: { nomeCurso: seed.curso.nomeCurso } });
      const curso = cursoRepo.create({ ...seed.curso, id: existing?.id });
      const savedCurso = await cursoRepo.save(curso);

      await moduloRepo.createQueryBuilder().delete().where('"cursoId" = :cursoId', { cursoId: savedCurso.id }).execute();

      for (const moduloSeed of seed.modulos) {
        const modulo = moduloRepo.create({
          nomeModulo: moduloSeed.nomeModulo,
          tempoModulo: moduloSeed.tempoModulo,
          curso: savedCurso,
        });
        const savedModulo = await moduloRepo.save(modulo);

        const aulas = moduloSeed.aulas.map((aula) =>
          aulaRepo.create({
            nomeAula: aula.nomeAula,
            tempoAula: aula.tempoAula,
            descricaoConteudo: aula.descricaoConteudo,
            materialApoio: aula.materialApoio ?? defaultMaterial,
            videoUrl: aula.videoUrl ?? defaultVideo,
            modulo: savedModulo,
          }),
        );

        await aulaRepo.save(aulas);
      }
    }

    console.log('Seed especial de busca semântica executada com sucesso!');
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  runSeedBuscaSemantica().catch((error) => {
    console.error('Erro ao rodar seed de busca semântica:', error);
    process.exit(1);
  });
}
