import { MeilisearchService } from '../infrastructure/search/meilisearch/meilisearch.service';

type SeedDocument = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  url: string;
};

async function run() {
  const meiliService = new MeilisearchService();
  await meiliService.onModuleInit();

  const documents: SeedDocument[] = [
    {
      id: 1,
      titulo: 'Fundamentos em Python',
      descricao: 'Estude os principais fundamentos da linguagem Python.',
      tipo: 'curso',
      url: '/curso/13',
    },
    {
      id: 2,
      titulo: 'Introdução ao React Native',
      descricao: 'Crie aplicativos iOS e Android com React Native.',
      tipo: 'curso',
      url: '/curso/2',
    },
    {
      id: 3,
      titulo: 'JavaScript Avançado para Web',
      descricao: 'Análise de dados, machine learning e visualização com Python.',
      tipo: 'curso',
      url: '/curso/12',
    },
  ];

  await meiliService.replaceAllDocuments(documents as any);
  console.log('Seed concluída');
}