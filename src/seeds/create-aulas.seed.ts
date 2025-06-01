import { DataSource } from 'typeorm';
import { AulaEntity } from 'src/infrastructure/database/entities/aula.entity';
import { ModuloEntity } from 'src/infrastructure/database/entities/modulo.entity';
import ormConfig from '../../ormconfig.migration';

export async function runSeedAulas() {
  const dataSource = ormConfig;
  await dataSource.initialize();

  const aulaRepo = dataSource.getRepository(AulaEntity);
  const moduloRepo = dataSource.getRepository(ModuloEntity);

  const modulos = await moduloRepo.find();

  const aulasParaInserir: Partial<AulaEntity>[] = [];

  for (const modulo of modulos) {
    const aulas: Partial<AulaEntity>[] = [
      {
        nomeAula: `Introdução ao módulo: ${modulo.nomeModulo}`,
        tempoAula: 5,
        videoUrl: 'https://www.youtube.com/embed/QGBkp-pvTi4?si=kwPdbIrkOMtf1ZXs',
        materialApoio: ['https://softsolutions.com.br/material/introducao.pdf'],
        descricaoConteudo: 'Apresentação dos objetivos e visão geral do módulo.',
        modulo
      },
      {
        nomeAula: `Conceitos principais de ${modulo.nomeModulo}`,
        tempoAula: 15,
        videoUrl: 'https://www.youtube.com/embed/QGBkp-pvTi4?si=kwPdbIrkOMtf1ZXs',
        materialApoio: ['https://softsolutions.com.br/material/conceitos.pdf'],
        descricaoConteudo: 'Exposição dos conceitos fundamentais e exemplos práticos.',
        modulo
      },
      {
        nomeAula: `Práticas e exercícios: ${modulo.nomeModulo}`,
        tempoAula: 10,
        videoUrl: 'https://www.youtube.com/embed/QGBkp-pvTi4?si=kwPdbIrkOMtf1ZXs',
        materialApoio: ['https://softsolutions.com.br/material/praticas.pdf'],
        descricaoConteudo: 'Atividades e aplicações práticas para consolidar o conhecimento.',
        modulo
      }
    ];

    aulasParaInserir.push(...aulas);
  }

  await aulaRepo.save(aulasParaInserir);

  console.log('Aulas para todos os módulos inseridas com sucesso!');
  await dataSource.destroy();
}
