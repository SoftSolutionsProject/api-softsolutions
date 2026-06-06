import axios from 'axios';
import { EmitirCertificadoUseCase } from './emitir-certificado.use-case';

jest.mock('pdfkit', () => {
  return class MockPdfDocument {
    page = { width: 842, height: 595 };
    y = 300;
    handlers: Record<string, (data?: Uint8Array) => void> = {};

    on(event: string, callback: (data?: Uint8Array) => void) {
      this.handlers[event] = callback;
      return this;
    }

    rect() {
      return this;
    }
    fill() {
      return this;
    }
    strokeColor() {
      return this;
    }
    lineWidth() {
      return this;
    }
    roundedRect() {
      return this;
    }
    stroke() {
      return this;
    }
    image() {
      return this;
    }
    moveDown() {
      return this;
    }
    fontSize() {
      return this;
    }
    font() {
      return this;
    }
    fillColor() {
      return this;
    }
    text() {
      return this;
    }
    moveTo() {
      return this;
    }
    lineTo() {
      return this;
    }
    end() {
      this.handlers.data?.(Buffer.from('pdf'));
      this.handlers.end?.();
    }
  };
});
jest.mock('axios');

describe('EmitirCertificadoUseCase PDF', () => {
  const inscricaoRepo = { findById: jest.fn() };
  const progressoRepo = { countConcluidasByInscricao: jest.fn() };
  const certificadoRepo = {
    findByInscricao: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.get as jest.Mock).mockResolvedValue({ data: Buffer.from('logo') });
  });

  it('gera o PDF real para certificado existente', async () => {
    const usuario = { id: 1, nomeUsuario: 'Lucas' };
    const curso = { id: 1, nomeCurso: 'NestJS', tempoCurso: 40, modulos: [] };
    inscricaoRepo.findById.mockResolvedValue({ usuario, curso });
    certificadoRepo.findByInscricao.mockResolvedValue({
      numeroSerie: 'serie',
      usuario,
      curso,
      dataEmissao: new Date('2026-01-02T00:00:00Z'),
    });
    const useCase = new EmitirCertificadoUseCase(
      inscricaoRepo as any,
      progressoRepo as any,
      certificadoRepo as any,
    );

    await expect(useCase.execute(1, 1)).resolves.toEqual(Buffer.from('pdf'));
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('logo.png'),
      { responseType: 'arraybuffer' },
    );
  });

  it('gera PDF usando carga horaria padrao', async () => {
    const usuario = { id: 1, nomeUsuario: 'Lucas' };
    const curso = { id: 1, nomeCurso: 'NestJS', modulos: [] };
    inscricaoRepo.findById.mockResolvedValue({ usuario, curso });
    certificadoRepo.findByInscricao.mockResolvedValue({
      numeroSerie: 'serie',
      usuario,
      curso,
      dataEmissao: new Date(),
    });
    const useCase = new EmitirCertificadoUseCase(
      inscricaoRepo as any,
      progressoRepo as any,
      certificadoRepo as any,
    );

    await expect(useCase.execute(1, 1)).resolves.toBeInstanceOf(Buffer);
  });
});
