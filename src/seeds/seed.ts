import { runSeedUsuarios } from './create-usuarios.seed';
import { runSeedCursos } from './create-cursos.seed';
import { runSeedModulos } from './create-modulos.seed';
import { runSeedAulas } from './create-aulas.seed';

async function runAllSeeds() {
  console.log('Rodando seeds de usuários...');
  await runSeedUsuarios();

  console.log('Rodando seeds de cursos...');
  await runSeedCursos();

  console.log('Rodando seeds de módulos...');
  await runSeedModulos();

  console.log('Rodando seeds de aulas...');
  await runSeedAulas();

  console.log('Seeds finalizados!');
}

runAllSeeds().catch(console.error);
