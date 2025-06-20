import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InscricaoRepository } from 'src/infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from 'src/infrastructure/database/repositories/progresso-aula.repository';
import { CertificadoRepository } from 'src/infrastructure/database/repositories/certificado.repository';
import { v4 as uuidv4 } from 'uuid';
import * as PDFDocument from 'pdfkit';
import { InscricaoModel } from 'src/domain/models/inscricao.model';
import { UsuarioModel } from 'src/domain/models/usuario.model';
import { CursoModel } from 'src/domain/models/curso.model';
import axios from 'axios';

@Injectable()
export class EmitirCertificadoUseCase {
  constructor(
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly progressoRepo: ProgressoAulaRepository,
    private readonly certificadoRepo: CertificadoRepository,
  ) {}

  async execute(idInscricao: number, idUsuario: number): Promise<Buffer> {
    const inscricao: InscricaoModel | null = await this.inscricaoRepo.findById(idInscricao);
    if (!inscricao || inscricao.usuario.id !== idUsuario) {
      throw new NotFoundException('Inscrição não encontrada ou não pertence ao usuário');
    }

    let certificado = await this.certificadoRepo.findByInscricao(inscricao);

    if (!certificado) {
      const totalAulas = inscricao.curso.modulos?.reduce(
        (total, modulo) => total + (modulo.aulas?.length || 0), 0
      ) || 0;

      const aulasConcluidas = await this.progressoRepo.countConcluidasByInscricao(idInscricao);
      if (totalAulas === 0 || aulasConcluidas !== totalAulas) {
        throw new ForbiddenException('Você precisa concluir todas as aulas para emitir o certificado');
      }

      const numeroSerie = uuidv4();
      certificado = await this.certificadoRepo.create({
        numeroSerie,
        usuario: inscricao.usuario,
        curso: inscricao.curso,
        dataEmissao: new Date(),
      });
    }

    const pdfBuffer = await this.gerarPdf(certificado.usuario, certificado.curso, certificado.numeroSerie, certificado.dataEmissao);
    return pdfBuffer;
  }

private async gerarPdf(
  usuario: UsuarioModel,
  curso: CursoModel,
  numeroSerie: string,
  dataEmissao: Date,
): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 40, layout: 'landscape' });
  const buffers: Uint8Array[] = [];

  doc.on('data', (data) => buffers.push(data));
  const endPromise = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });

  // Baixa o logo como buffer
  const response = await axios.get('https://raw.githubusercontent.com/SoftSolutionsProject/img/refs/heads/main/logo.png', {
    responseType: 'arraybuffer',
  });
  const logoBuffer = Buffer.from(response.data, 'binary');

  // Fundo e borda decorativa
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F8F9FA');
  doc.strokeColor('#E9ECEF').lineWidth(15).roundedRect(30, 30, doc.page.width - 60, doc.page.height - 60, 10).stroke();

  // Cabeçalho com logo (ajustado mais para cima)
  doc.image(logoBuffer, doc.page.width / 2 - 60, 50, {
    width: 160,
    align: 'center',
  });

  // Título
  doc.moveDown(4.2);
  doc.fontSize(30).font('Helvetica-Bold').fillColor('#2C3E50').text('CERTIFICADO DE CONCLUSÃO', {
    align: 'center',
  });

  // Linha decorativa
  doc.moveDown(0.5);
  doc.strokeColor('#3498DB').lineWidth(2).moveTo(doc.page.width * 0.25, doc.y).lineTo(doc.page.width * 0.75, doc.y).stroke();

  // Corpo do texto
  doc.moveDown(1.8);
  doc.fontSize(16).font('Helvetica').fillColor('#495057').text('Certificamos que', { align: 'center' });

  doc.moveDown(1);
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#2980B9').text(usuario.nomeUsuario.toUpperCase(), { align: 'center' });

  doc.moveDown(1);
  doc.fontSize(16).font('Helvetica').fillColor('#495057').text('concluiu com êxito o curso de', { align: 'center' });

  doc.moveDown(1);
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#27AE60').text(`"${curso.nomeCurso.toUpperCase()}"`, { align: 'center' });

  doc.moveDown(0.8);
  doc.fontSize(14).font('Helvetica-Oblique').fillColor('#7F8C8D')
    .text(`com carga horária de ${curso.tempoCurso || 'XX'} horas`, { align: 'center' });

  // Espaço antes do rodapé
  doc.moveDown(2.2);

  const yRodape = doc.y;
  doc.fontSize(12).font('Helvetica').fillColor('#7F8C8D')
    .text(`Data de emissão: ${this.formatarData(dataEmissao)}`, 50, yRodape, { align: 'left' })
    .text(`Nº do certificado: ${numeroSerie}`, -50, yRodape, { align: 'right' });

  // Link de verificação
  doc.moveDown(2.5);
  doc.fontSize(10).fillColor('#95A5A6').text(
    'Este certificado pode ser verificado em: solutionssoft.vercel.app/certificados',
    { align: 'center', oblique: true }
  );

  doc.end();
  return endPromise;
}

  private formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
