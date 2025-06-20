import { CertificadoController } from './certificado.controller';

describe('CertificadoController', () => {
  let controller: CertificadoController;
  let emitirCertificadoUseCase: any;
  let certificadoRepo: any;

  beforeEach(() => {
    emitirCertificadoUseCase = { execute: jest.fn() };
    certificadoRepo = { findByNumeroSerie: jest.fn() };

    controller = new CertificadoController(
      emitirCertificadoUseCase,
      certificadoRepo,
    );
  });

  it('deve emitir certificado chamando use case', async () => {
    emitirCertificadoUseCase.execute.mockResolvedValue(Buffer.from('PDF'));
    const mockRes = { set: jest.fn(), end: jest.fn() };
    await controller.emitir(1, 1, mockRes as any);

    expect(emitirCertificadoUseCase.execute).toHaveBeenCalledWith(1, 1);
    expect(mockRes.set).toHaveBeenCalled();
    expect(mockRes.end).toHaveBeenCalled();
  });

  it('deve validar certificado público', async () => {
    const certMock = {
      id: 1,  // ✅ adicionado para ser compatível
      numeroSerie: 'mock-uuid',
      usuario: { nomeUsuario: 'Lucas' },
      curso: { nomeCurso: 'Curso X', tempoCurso: 40 },
      dataEmissao: new Date(),
    };
    certificadoRepo.findByNumeroSerie.mockResolvedValue(certMock);
    const result = await controller.validar('mock-uuid');

    expect(result.numeroSerie).toBe(certMock.numeroSerie);
    expect(result.aluno).toBe(certMock.usuario.nomeUsuario);
  });
});
