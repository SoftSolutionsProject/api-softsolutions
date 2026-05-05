import { DashboardRepository } from './dashboard.repository';

describe('DashboardRepository', () => {
  let repo: DashboardRepository;
  let inscricaoRepo: any;
  let certificadoRepo: any;
  let progressoRepo: any;
  let cursoRepo: any;
  let avaliacaoRepo: any;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-29T12:00:00.000Z'));
    inscricaoRepo = { findByUsuario: jest.fn() };
    certificadoRepo = { findAllByUsuario: jest.fn() };
    progressoRepo = {};
    cursoRepo = {};
    avaliacaoRepo = {
      getCourseAverage: jest.fn().mockResolvedValue(0),
      findByUserAndCourse: jest.fn().mockResolvedValue(null),
    };
    repo = new DashboardRepository(
      inscricaoRepo,
      certificadoRepo,
      progressoRepo,
      cursoRepo,
      avaliacaoRepo,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve retornar dashboard com dados mínimos', async () => {
    inscricaoRepo.findByUsuario.mockResolvedValue([]);
    certificadoRepo.findAllByUsuario.mockResolvedValue([]);

    const result = await repo.getDashboardData(1);

    expect(result).toEqual(
      expect.objectContaining({
        totalCursosInscritos: 0,
        totalCertificados: 0,
        diasAtivosEstudo: 0,
        ultimoDiaAtividade: null,
        diasConsecutivosEstudo: 0,
        sequenciaAtualDiasConsecutivos: 0,
      }),
    );
  });

  it('deve calcular progresso, histórico, categorias, notas e avaliações', async () => {
    inscricaoRepo.findByUsuario.mockResolvedValue([
      {
        status: 'ativo',
        curso: { id: 1, nomeCurso: 'Curso A', categoria: 'Backend' },
        progressoAulas: [
          {
            concluida: true,
            dataConclusao: new Date('2026-04-28T10:00:00.000Z'),
            aula: { tempoAula: 30 },
          },
          {
            concluida: false,
            dataConclusao: null,
            aula: { tempoAula: 25 },
          },
        ],
      },
      {
        status: 'ativo',
        curso: { id: 2, nomeCurso: 'Curso B', categoria: undefined },
        progressoAulas: [
          {
            concluida: true,
            dataConclusao: new Date('2026-04-29T10:00:00.000Z'),
            aula: { tempoAula: 40 },
          },
        ],
      },
      {
        status: 'cancelado',
        curso: { id: 3, nomeCurso: 'Curso C', categoria: 'Frontend' },
        progressoAulas: [],
      },
    ]);
    certificadoRepo.findAllByUsuario.mockResolvedValue([{}, {}]);
    avaliacaoRepo.getCourseAverage
      .mockResolvedValueOnce(4.5)
      .mockResolvedValueOnce(3.8)
      .mockResolvedValueOnce(5);
    avaliacaoRepo.findByUserAndCourse
      .mockResolvedValueOnce({ id: 10 })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 11 });

    const result = await repo.getDashboardData(7);

    expect(result.totalCursosInscritos).toBe(2);
    expect(result.totalCertificados).toBe(2);
    expect(result.progressoPorCurso).toEqual([
      { cursoId: 1, nomeCurso: 'Curso A', percentualConcluido: 50 },
      { cursoId: 2, nomeCurso: 'Curso B', percentualConcluido: 100 },
    ]);
    expect(result.historicoEstudo).toEqual([
      { data: '2026-04-28', minutosEstudados: 30 },
      { data: '2026-04-29', minutosEstudados: 40 },
    ]);
    expect(result.cursosPorCategoria).toEqual([
      { categoria: 'Backend', total: 1 },
      { categoria: 'Outros', total: 1 },
    ]);
    expect(result.notasMediasPorCurso).toEqual([
      { cursoId: 1, nomeCurso: 'Curso A', notaMedia: 4.5 },
      { cursoId: 2, nomeCurso: 'Curso B', notaMedia: 3.8 },
      { cursoId: 3, nomeCurso: 'Curso C', notaMedia: 5 },
    ]);
    expect(result.tempoTotalEstudoMinutos).toBe(70);
    expect(result.avaliacoes).toEqual([
      { cursoId: 1, nomeCurso: 'Curso A', avaliacaoFeita: true },
      { cursoId: 2, nomeCurso: 'Curso B', avaliacaoFeita: false },
      { cursoId: 3, nomeCurso: 'Curso C', avaliacaoFeita: true },
    ]);
    expect(result.diasConsecutivosEstudo).toBe(2);
    expect(result.sequenciaAtualDiasConsecutivos).toBe(2);
    expect(result.ultimoDiaAtividade).toBe('2026-04-29');
  });

  it('deve calcular helpers privados com quebras e dados faltantes', () => {
    expect((repo as any).getDiasConsecutivos([])).toBe(0);
    expect(
      (repo as any).getDiasConsecutivos([
        '2026-04-20',
        '2026-04-21',
        '2026-04-23',
      ]),
    ).toBe(2);
    expect(
      (repo as any).getSequenciaAtualConsecutiva(['2026-04-27', '2026-04-25']),
    ).toBe(0);
    expect(
      (repo as any).getCursosPorCategoria([{ curso: { categoria: undefined } }]),
    ).toEqual([{ categoria: 'Outros', total: 1 }]);
    expect(
      (repo as any).getTempoTotalEstudado([
        {
          progressoAulas: [
            { concluida: true, aula: { tempoAula: 20 } },
            { concluida: true, aula: { tempoAula: 0 } },
            { concluida: false, aula: { tempoAula: 50 } },
          ],
        },
      ]),
    ).toBe(20);
  });

  it('deve agregar histórico no mesmo dia e usar fallbacks de curso nas notas e avaliações', async () => {
    const inscricoes = [
      {
        curso: undefined,
        progressoAulas: [
          {
            dataConclusao: new Date('2026-04-29T09:00:00.000Z'),
            aula: { tempoAula: 10 },
          },
          {
            dataConclusao: new Date('2026-04-29T12:00:00.000Z'),
            aula: undefined,
          },
        ],
      },
    ];
    avaliacaoRepo.getCourseAverage.mockResolvedValueOnce(0);
    avaliacaoRepo.findByUserAndCourse.mockResolvedValueOnce(null);

    expect((repo as any).getHistoricoEstudo(inscricoes)).toEqual([
      { data: '2026-04-29', minutosEstudados: 10 },
    ]);
    await expect((repo as any).getNotasMedias(inscricoes)).resolves.toEqual([
      { cursoId: 0, nomeCurso: '', notaMedia: 0 },
    ]);
    await expect((repo as any).getAvaliacoesPorUsuario(1, inscricoes)).resolves.toEqual([
      { cursoId: 0, nomeCurso: '', avaliacaoFeita: false },
    ]);
  });

  it('deve manter streak 1 quando houver datas repetidas e sequência atual parcial', () => {
    expect(
      (repo as any).getDiasConsecutivos([
        '2026-04-27',
        '2026-04-27',
        '2026-04-29',
      ]),
    ).toBe(1);
    expect(
      (repo as any).getSequenciaAtualConsecutiva([
        '2026-04-29',
        '2026-04-27',
      ]),
    ).toBe(1);
  });
});
