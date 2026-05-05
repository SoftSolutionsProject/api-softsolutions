import { CertificadoModel } from './certificado.model';

describe('CertificadoModel', () => {
  it('deve criar um modelo de certificado', () => {
    const model: CertificadoModel = {
      id: 1,
      numeroSerie: 'ABC123',
      usuario: { id: 1 } as any,
      curso: { id: 1 } as any,
      dataEmissao: new Date(),
      urlPdf: 'url',
    };
    expect(model).toBeDefined();
    expect(model.numeroSerie).toBe('ABC123');
  });
});
