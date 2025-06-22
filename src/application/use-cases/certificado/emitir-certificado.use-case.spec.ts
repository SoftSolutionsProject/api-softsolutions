import { EmitirCertificadoUseCase } from './emitir-certificado.use-case';

describe('EmitirCertificadoUseCase', () => {
  let useCase: EmitirCertificadoUseCase;
  let inscricaoRepo: any;
  let progressoRepo: any;
  let certificadoRepo: any;

  const inscricaoMock = {
    id: 1,
    usuario: { id: 1 },
    curso: {
      id: 1,
      modulos: [
        { aulas: [{}, {}] },
        { aulas: [{}] },
      ],
    },
  };

  beforeEach(() => {
    inscricaoRepo = { findById: jest.fn() };
    progressoRepo = { countConcluidasByInscricao: jest.fn() };
    certificadoRepo = { findByInscricao: jest.fn(), create: jest.fn() };

    useCase = new EmitirCertificadoUseCase(inscricaoRepo, progressoRepo, certificadoRepo);

    // ✅ Mocka o método gerarPdf para evitar PDF real
    useCase['gerarPdf'] = jest.fn().mockResolvedValue(Buffer.from('mock-pdf'));
  });

  it('deve lançar NotFound se inscrição inválida', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, 1)).rejects.toThrow('Inscrição não encontrada ou não pertence ao usuário');
  });

  it('deve lançar NotFound se inscrição não pertencer ao usuário', async () => {
    inscricaoRepo.findById.mockResolvedValue({ ...inscricaoMock, usuario: { id: 999 } });
    await expect(useCase.execute(1, 1)).rejects.toThrow('Inscrição não encontrada ou não pertence ao usuário');
  });

  it('deve lançar Forbidden se não concluiu todas as aulas', async () => {
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(1); // Precisa ser 3

    await expect(useCase.execute(1, 1)).rejects.toThrow('Você precisa concluir todas as aulas para emitir o certificado');
  });

  it('deve emitir certificado novo se não existir', async () => {
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(3);

    certificadoRepo.create.mockResolvedValue({
      numeroSerie: 'uuid',
      usuario: inscricaoMock.usuario,
      curso: inscricaoMock.curso,
      dataEmissao: new Date(),
    });

    const result = await useCase.execute(1, 1);

    expect(result).toBeInstanceOf(Buffer);
    expect(useCase['gerarPdf']).toHaveBeenCalled();
  });

  it('deve gerar PDF se certificado já existir', async () => {
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    certificadoRepo.findByInscricao.mockResolvedValue({
      numeroSerie: 'uuid',
      usuario: inscricaoMock.usuario,
      curso: inscricaoMock.curso,
      dataEmissao: new Date(),
    });

    const result = await useCase.execute(1, 1);

    expect(result).toBeInstanceOf(Buffer);
    expect(useCase['gerarPdf']).toHaveBeenCalled();
  });
});
