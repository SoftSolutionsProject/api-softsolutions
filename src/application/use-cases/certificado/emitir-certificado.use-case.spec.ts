import { ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { EmitirCertificadoUseCase } from './emitir-certificado.use-case';

const docInstances: any[] = [];

jest.mock('axios');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('pdfkit', () =>
  jest.fn().mockImplementation(() => {
    const handlers: Record<string, Function> = {};
    const instance = {
      page: { width: 1000, height: 700 },
      y: 120,
      on: jest.fn((event: string, handler: Function) => {
        handlers[event] = handler;
        return instance;
      }),
      rect: jest.fn(() => instance),
      fill: jest.fn(() => instance),
      strokeColor: jest.fn(() => instance),
      lineWidth: jest.fn(() => instance),
      roundedRect: jest.fn(() => instance),
      stroke: jest.fn(() => instance),
      image: jest.fn(() => instance),
      moveDown: jest.fn(() => instance),
      fontSize: jest.fn(() => instance),
      font: jest.fn(() => instance),
      fillColor: jest.fn(() => instance),
      text: jest.fn(() => instance),
      moveTo: jest.fn(() => instance),
      lineTo: jest.fn(() => instance),
      end: jest.fn(() => {
        handlers.data?.(Buffer.from('pdf-content'));
        handlers.end?.();
        return instance;
      }),
    };
    docInstances.push(instance);
    return instance;
  }),
);

describe('EmitirCertificadoUseCase', () => {
  let useCase: EmitirCertificadoUseCase;
  let inscricaoRepo: any;
  let progressoRepo: any;
  let certificadoRepo: any;

  const inscricaoMock = {
    id: 1,
    usuario: { id: 1, nomeUsuario: 'Lucas' },
    curso: {
      id: 1,
      nomeCurso: 'Node',
      tempoCurso: 20,
      modulos: [{ aulas: [{}, {}] }, { aulas: [{}] }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    docInstances.length = 0;

    inscricaoRepo = { findById: jest.fn() };
    progressoRepo = { countConcluidasByInscricao: jest.fn() };
    certificadoRepo = { findByInscricao: jest.fn(), create: jest.fn() };

    useCase = new EmitirCertificadoUseCase(
      inscricaoRepo,
      progressoRepo,
      certificadoRepo,
    );

    (uuidv4 as jest.Mock).mockReturnValue('uuid-123');
    (axios.get as jest.Mock).mockResolvedValue({
      data: Buffer.from('logo'),
    });
  });

  it('deve lançar NotFound se inscrição inválida', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 1)).rejects.toThrow(
      'Inscrição não encontrada ou não pertence ao usuário',
    );
  });

  it('deve lançar NotFound se inscrição não pertencer ao usuário', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      ...inscricaoMock,
      usuario: { id: 999 },
    });

    await expect(useCase.execute(1, 1)).rejects.toThrow(
      'Inscrição não encontrada ou não pertence ao usuário',
    );
  });

  it('deve lançar Forbidden quando não concluiu todas as aulas', async () => {
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(1);

    await expect(useCase.execute(1, 1)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar Forbidden quando o curso não tiver aulas', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      ...inscricaoMock,
      curso: { ...inscricaoMock.curso, modulos: undefined },
    });
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(0);

    await expect(useCase.execute(1, 1)).rejects.toThrow(
      'Você precisa concluir todas as aulas para emitir o certificado',
    );
  });

  it('deve considerar módulos sem aulas como zero no total', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      ...inscricaoMock,
      curso: { ...inscricaoMock.curso, modulos: [{ aulas: undefined }] },
    });
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(0);

    await expect(useCase.execute(1, 1)).rejects.toThrow(ForbiddenException);
  });

  it('deve criar certificado novo quando ainda não existir', async () => {
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(3);
    certificadoRepo.create.mockResolvedValue({
      numeroSerie: 'uuid-123',
      usuario: inscricaoMock.usuario,
      curso: inscricaoMock.curso,
      dataEmissao: new Date('2026-04-29T00:00:00.000Z'),
    });

    const pdfSpy = jest
      .spyOn(useCase as any, 'gerarPdf')
      .mockResolvedValue(Buffer.from('mock-pdf'));

    const result = await useCase.execute(1, 1);

    expect(result).toBeInstanceOf(Buffer);
    expect(certificadoRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        numeroSerie: 'uuid-123',
        usuario: inscricaoMock.usuario,
        curso: inscricaoMock.curso,
      }),
    );
    expect(pdfSpy).toHaveBeenCalled();
  });

  it('deve reutilizar certificado existente sem criar outro', async () => {
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    certificadoRepo.findByInscricao.mockResolvedValue({
      numeroSerie: 'existente',
      usuario: inscricaoMock.usuario,
      curso: inscricaoMock.curso,
      dataEmissao: new Date('2026-04-29T00:00:00.000Z'),
    });
    const pdfSpy = jest
      .spyOn(useCase as any, 'gerarPdf')
      .mockResolvedValue(Buffer.from('mock-pdf'));

    await useCase.execute(1, 1);

    expect(progressoRepo.countConcluidasByInscricao).not.toHaveBeenCalled();
    expect(certificadoRepo.create).not.toHaveBeenCalled();
    expect(pdfSpy).toHaveBeenCalled();
  });

  it('deve gerar pdf usando o logo remoto e devolver buffer', async () => {
    const buffer = await (useCase as any).gerarPdf(
      { nomeUsuario: 'Lucas' },
      { nomeCurso: 'Node', tempoCurso: 20 },
      'serie-1',
      new Date('2026-04-29T00:00:00.000Z'),
    );

    expect(axios.get).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/logo.png',
      { responseType: 'arraybuffer' },
    );
    expect(buffer).toBeInstanceOf(Buffer);
    expect(docInstances[0].image).toHaveBeenCalled();
    expect(docInstances[0].text).toHaveBeenCalled();
  });

  it('deve usar XX horas quando o curso não tiver carga horária', async () => {
    await (useCase as any).gerarPdf(
      { nomeUsuario: 'Lucas' },
      { nomeCurso: 'Node', tempoCurso: undefined },
      'serie-1',
      new Date('2026-04-29T00:00:00.000Z'),
    );

    expect(docInstances[0].text).toHaveBeenCalledWith(
      'com carga horária de XX horas',
      { align: 'center' },
    );
  });

  it('deve formatar data em pt-BR', () => {
    expect((useCase as any).formatarData(new Date('2026-04-29T00:00:00.000Z'))).toContain(
      '2026',
    );
  });
});
