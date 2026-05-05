import { runSeedUsuarios } from './create-usuarios.seed';
import { runSeedCursos } from './create-cursos.seed';
import { runSeedModulos } from './create-modulos.seed';
import { runSeedAulas } from './create-aulas.seed';
import { seedDataSource } from './seed-data-source';

async function runAllSeeds() {
  if (!seedDataSource.isInitialized) {
    await seedDataSource.initialize();
  }

  console.log('Rodando seeds de usuários...');
  await runSeedUsuarios();

  console.log('Rodando seeds de cursos...');
  await runSeedCursos();

  console.log('Rodando seeds de módulos...');
  await runSeedModulos();

  console.log('Rodando seeds de aulas...');
  await runSeedAulas();

  console.log('Seeds finalizados!');
  await seedDataSource.destroy();
}

runAllSeeds().catch(async (error) => {
  console.error(error);

  if (seedDataSource.isInitialized) {
    await seedDataSource.destroy();
  }

  process.exit(1);
});