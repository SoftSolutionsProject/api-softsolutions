import Curso from '../models/Curso';

export const adicionarCurso = async (cursoData: any): Promise<any> => {
  // Gerar _idCurso automaticamente
  const ultimoCurso = await Curso.findOne().sort({ _idCurso: -1 });
  const novoIdCurso = ultimoCurso ? ultimoCurso._idCurso + 1 : 1;

  // Gerar _idModulo e _idAula para cada módulo e aula
  cursoData.modulos = cursoData.modulos.map((modulo: any, indexModulo: number) => {
    const _idModulo = novoIdCurso * 100 + (indexModulo + 1); // IDs baseados no curso
    modulo._idModulo = _idModulo;

    modulo.aulas = modulo.aulas.map((aula: any, indexAula: number) => {
      aula._idAula = _idModulo * 100 + (indexAula + 1); // IDs baseados no módulo
      return aula;
    });

    return modulo;
  });

  // Criar o curso
  const novoCurso = new Curso({
    _idCurso: novoIdCurso,
    ...cursoData,
  });

  return await novoCurso.save();
};
