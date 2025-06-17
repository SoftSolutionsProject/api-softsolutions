
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { EmitirCertificadoUseCase } from 'src/application/use-cases/certificado/emitir-certificado.use-case';
import { Response } from 'express';
import { CertificadoRepository } from 'src/infrastructure/database/repositories/certificado.repository';
import { CertificadoPublicoResponseDto } from '../dtos/responses/certificado-publico.response.dto';

@Controller('certificados')
export class CertificadoController {
  constructor(
    private readonly emitirCertificadoUseCase: EmitirCertificadoUseCase,
    private readonly certificadoRepo: CertificadoRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':idInscricao')
  async emitir(
    @Param('idInscricao') idInscricao: number,
    @User('sub') idUsuario: number,
    @Res() res: Response,
  ) {
    // Chama o use case para gerar o certificado (ou retornar erro se já existir)
    const pdfBuffer = await this.emitirCertificadoUseCase.execute(idInscricao, idUsuario);

    // Retorna o PDF como download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificado.pdf',
    });
    res.end(pdfBuffer);
  }

  @Get('publico/:numeroSerie')
async validar(@Param('numeroSerie') numeroSerie: string) {
  const certificado = await this.certificadoRepo.findByNumeroSerie(numeroSerie);
  if (!certificado) throw new NotFoundException('Certificado não encontrado');

  return new CertificadoPublicoResponseDto(certificado);
}

}
