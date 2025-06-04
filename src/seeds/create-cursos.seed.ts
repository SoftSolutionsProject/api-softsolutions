import { DataSource } from 'typeorm';
import { CursoEntity } from 'src/infrastructure/database/entities/curso.entity';
import ormConfig from '../../ormconfig.migration';

export async function runSeedCursos() {
  const dataSource = ormConfig;
  await dataSource.initialize();

  const repo = dataSource.getRepository(CursoEntity);

  await repo.insert([
    {
      nomeCurso: 'Desenvolvimento Web com Python',
      tempoCurso: 40,
      descricaoCurta: 'Crie aplicações web dinâmicas com Python.',
      descricaoDetalhada: 'Aprenda a usar Python em projetos reais de back-end, integrando com bancos de dados e APIs REST.',
      professor: 'Lucas Ferreira',
      categoria: 'Backend',
      status: 'ativo',
      avaliacao: 4.8,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/1.png'
    },
    {
      nomeCurso: 'Aplicativos Móveis com React Native',
      tempoCurso: 50,
      descricaoCurta: 'Desenvolva apps para iOS e Android com React Native.',
      descricaoDetalhada: 'Domine a criação de apps híbridos, explorando componentes, navegação e integração com APIs.',
      professor: 'Ana Paula',
      categoria: 'Mobile',
      status: 'ativo',
      avaliacao: 4.7,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/2.png'
    },
    {
      nomeCurso: 'UX/UI Design para Iniciantes',
      tempoCurso: 30,
      descricaoCurta: 'Aprenda as bases de UX e UI Design.',
      descricaoDetalhada: 'Explore a criação de interfaces intuitivas e agradáveis, com foco em experiência do usuário.',
      professor: 'Maria Souza',
      categoria: 'Design',
      status: 'ativo',
      avaliacao: 4.6,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/3.png'
    },
    {
      nomeCurso: 'Desenvolvimento Java para Web',
      tempoCurso: 60,
      descricaoCurta: 'Crie aplicações web robustas em Java.',
      descricaoDetalhada: 'Aprenda a usar Java no desenvolvimento de sistemas escaláveis e performáticos.',
      professor: 'João Silva',
      categoria: 'Backend',
      status: 'ativo',
      avaliacao: 4.9,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/4.png'
    },
    {
      nomeCurso: 'Programação Web com PHP',
      tempoCurso: 45,
      descricaoCurta: 'Domine a linguagem PHP no back-end.',
      descricaoDetalhada: 'Construa sites e APIs dinâmicas utilizando PHP e boas práticas de desenvolvimento.',
      professor: 'Carla Dias',
      categoria: 'Backend',
      status: 'ativo',
      avaliacao: 4.5,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/5.png'
    },
    {
      nomeCurso: 'HTML5: Estrutura e Semântica',
      tempoCurso: 25,
      descricaoCurta: 'Fundamentos e semântica do HTML5.',
      descricaoDetalhada: 'Construa páginas web organizadas e acessíveis utilizando a linguagem base da web.',
      professor: 'Pedro Lima',
      categoria: 'Frontend',
      status: 'ativo',
      avaliacao: 4.7,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/6.png'
    },
    {
      nomeCurso: 'Banco de Dados com MS SQL Server',
      tempoCurso: 50,
      descricaoCurta: 'Administre e otimize bancos de dados SQL Server.',
      descricaoDetalhada: 'Aprenda a modelar, consultar e manter bancos de dados robustos usando MS SQL Server.',
      professor: 'Lucas Carvalho',
      categoria: 'Banco de Dados',
      status: 'ativo',
      avaliacao: 4.6,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/7.png'
    },
    {
      nomeCurso: 'Versionamento de Código com Git',
      tempoCurso: 20,
      descricaoCurta: 'Gerencie seu código com Git e GitHub.',
      descricaoDetalhada: 'Aprenda a usar Git para controlar versões, colaborar em equipe e trabalhar com repositórios.',
      professor: 'Juliana Gomes',
      categoria: 'DevOps',
      status: 'ativo',
      avaliacao: 4.8,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/8.png'
    },
    {
      nomeCurso: 'Web Design Responsivo',
      tempoCurso: 30,
      descricaoCurta: 'Crie interfaces adaptáveis para todos os dispositivos.',
      descricaoDetalhada: 'Explore técnicas de design responsivo para oferecer a melhor experiência em qualquer tela.',
      professor: 'Renato Silva',
      categoria: 'Design',
      status: 'ativo',
      avaliacao: 4.9,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/9.png'
    },
    {
      nomeCurso: 'Introdução à Computação em Nuvem',
      tempoCurso: 40,
      descricaoCurta: 'Entenda os conceitos e práticas de cloud computing.',
      descricaoDetalhada: 'Aprenda a usar serviços em nuvem para escalar e otimizar aplicações.',
      professor: 'Bianca Martins',
      categoria: 'Infraestrutura',
      status: 'ativo',
      avaliacao: 4.6,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/10.png'
    },
    {
      nomeCurso: 'Design Generativo e Algoritmos',
      tempoCurso: 35,
      descricaoCurta: 'Descubra como criar com algoritmos generativos.',
      descricaoDetalhada: 'Explore como criar padrões e obras interativas usando programação criativa.',
      professor: 'Roberto Souza',
      categoria: 'Design',
      status: 'ativo',
      avaliacao: 4.7,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/11.png'
    },
    {
      nomeCurso: 'JavaScript Avançado para Web',
      tempoCurso: 55,
      descricaoCurta: 'Aprofunde seus conhecimentos em JavaScript.',
      descricaoDetalhada: 'Aprenda recursos avançados e boas práticas para aplicações web modernas.',
      professor: 'Camila Oliveira',
      categoria: 'Frontend',
      status: 'ativo',
      avaliacao: 4.9,
      imagemCurso: 'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/cards/12.png'
    }
  ]);

  console.log('Cursos inseridos com sucesso!');
  await dataSource.destroy();
}


