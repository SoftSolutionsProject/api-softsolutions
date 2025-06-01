import { DataSource } from 'typeorm';
import { ModuloEntity } from 'src/infrastructure/database/entities/modulo.entity';
import { CursoEntity } from 'src/infrastructure/database/entities/curso.entity';
import ormConfig from '../../ormconfig.migration';

export async function runSeedModulos() {
  const dataSource = ormConfig;
  await dataSource.initialize();

  const moduloRepo = dataSource.getRepository(ModuloEntity);
  const cursoRepo = dataSource.getRepository(CursoEntity);

  const cursos = await cursoRepo.find();

  const modulosPorCurso = [
    {
      curso: 'Desenvolvimento Web com Python',
      modulos: [
        { nome: 'Introdução ao Python e Flask', tempo: 15 },
        { nome: 'Modelagem de Dados e SQLAlchemy', tempo: 20 },
        { nome: 'Integração de APIs e Autenticação', tempo: 25 },
        { nome: 'Gerenciamento de Sessões e Cookies', tempo: 15 },
        { nome: 'Desempenho e Escalabilidade', tempo: 20 }
      ]
    },
    {
      curso: 'Aplicativos Móveis com React Native',
      modulos: [
        { nome: 'Ambiente e Primeiros Passos', tempo: 15 },
        { nome: 'Componentes e Navegação', tempo: 20 },
        { nome: 'Integração com APIs e Banco de Dados', tempo: 25 },
        { nome: 'Testes e Debugging', tempo: 15 },
        { nome: 'Publicação e Distribuição', tempo: 20 }
      ]
    },
    {
      curso: 'UX/UI Design para Iniciantes',
      modulos: [
        { nome: 'Fundamentos de UX', tempo: 10 },
        { nome: 'Princípios Visuais e Hierarquia', tempo: 15 },
        { nome: 'Ferramentas de Prototipagem', tempo: 20 },
        { nome: 'Design de Interação', tempo: 15 },
        { nome: 'Testes de Usabilidade', tempo: 10 }
      ]
    },
    {
      curso: 'Desenvolvimento Java para Web',
      modulos: [
        { nome: 'Conceitos e Estruturas Java', tempo: 20 },
        { nome: 'Spring Boot e MVC', tempo: 25 },
        { nome: 'Segurança e Boas Práticas', tempo: 15 },
        { nome: 'JPA e Persistência de Dados', tempo: 20 },
        { nome: 'Integração com Front-end', tempo: 15 }
      ]
    },
    {
      curso: 'Programação Web com PHP',
      modulos: [
        { nome: 'Fundamentos do PHP', tempo: 15 },
        { nome: 'Laravel e Padrões de Projeto', tempo: 20 },
        { nome: 'Boas Práticas e Segurança', tempo: 15 },
        { nome: 'Trabalhando com APIs REST', tempo: 20 },
        { nome: 'Testes e Depuração', tempo: 15 }
      ]
    },
    {
      curso: 'HTML5: Estrutura e Semântica',
      modulos: [
        { nome: 'Introdução ao HTML5', tempo: 10 },
        { nome: 'Estrutura Semântica e SEO', tempo: 15 },
        { nome: 'Acessibilidade e Melhores Práticas', tempo: 10 },
        { nome: 'Formulários Avançados', tempo: 15 },
        { nome: 'Boas Práticas de Marcação', tempo: 10 }
      ]
    },
    {
      curso: 'Banco de Dados com MS SQL Server',
      modulos: [
        { nome: 'Modelagem e Consultas', tempo: 20 },
        { nome: 'Procedures e Otimização', tempo: 25 },
        { nome: 'Backup e Recuperação', tempo: 15 },
        { nome: 'Segurança e Permissões', tempo: 20 },
        { nome: 'Integração com Aplicações', tempo: 15 }
      ]
    },
    {
      curso: 'Versionamento de Código com Git',
      modulos: [
        { nome: 'Fundamentos e Instalação', tempo: 10 },
        { nome: 'Branches e Merge', tempo: 15 },
        { nome: 'Colaboração com Pull Requests', tempo: 15 },
        { nome: 'Revertendo Mudanças', tempo: 10 },
        { nome: 'Fluxos de Trabalho com Git', tempo: 10 }
      ]
    },
    {
      curso: 'Web Design Responsivo',
      modulos: [
        { nome: 'Princípios do Design Responsivo', tempo: 10 },
        { nome: 'Media Queries e Layouts', tempo: 15 },
        { nome: 'Boas Práticas e Performance', tempo: 15 },
        { nome: 'Design Mobile-First', tempo: 10 },
        { nome: 'Imagens e Recursos Flexíveis', tempo: 10 }
      ]
    },
    {
      curso: 'Introdução à Computação em Nuvem',
      modulos: [
        { nome: 'Fundamentos e Conceitos', tempo: 15 },
        { nome: 'Serviços e Modelos de Nuvem', tempo: 20 },
        { nome: 'Segurança e Custos', tempo: 15 },
        { nome: 'Ferramentas e Plataformas', tempo: 15 },
        { nome: 'Tendências e Futuro da Nuvem', tempo: 10 }
      ]
    },
    {
      curso: 'Design Generativo e Algoritmos',
      modulos: [
        { nome: 'Conceitos e Ferramentas', tempo: 15 },
        { nome: 'Criação de Algoritmos Visuais', tempo: 20 },
        { nome: 'Exemplos Práticos e Aplicações', tempo: 15 },
        { nome: 'Animações e Interatividade', tempo: 15 },
        { nome: 'Casos de Uso Avançados', tempo: 15 }
      ]
    },
    {
      curso: 'JavaScript Avançado para Web',
      modulos: [
        { nome: 'ES6+ e Recursos Avançados', tempo: 20 },
        { nome: 'Manipulação Avançada de DOM', tempo: 20 },
        { nome: 'Boas Práticas e Performance', tempo: 15 },
        { nome: 'Web APIs e Padrões Modernos', tempo: 15 },
        { nome: 'Testes e Ferramentas de Debug', tempo: 15 }
      ]
    }
  ];

  for (const curso of cursos) {
    const modulosCurso = modulosPorCurso.find(m => m.curso === curso.nomeCurso);
    if (modulosCurso) {
      for (const modulo of modulosCurso.modulos) {
        await moduloRepo.insert({
          nomeModulo: modulo.nome,
          tempoModulo: modulo.tempo,
          curso
        });
      }
    }
  }

  console.log('Módulos (5 por curso) inseridos com sucesso!');
  await dataSource.destroy();
}
