import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { EmitirCertificadoUseCase } from 'src/application/use-cases/certificado/emitir-certificado.use-case';
import { Response } from 'express';
import { CertificadoRepository } from 'src/infrastructure/database/repositories/certificado.repository';
import { CertificadoPublicoResponseDto } from '../dtos/responses/certificado-publico.response.dto';

@ApiTags('Certificados')
@Controller('certificados')
export class CertificadoController {
  constructor(
    private readonly emitirCertificadoUseCase: EmitirCertificadoUseCase,
    private readonly certificadoRepo: CertificadoRepository,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':idInscricao')
  @ApiOperation({ summary: 'Emitir certificado em PDF (download)' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiResponse({ status: 200, description: 'Certificado gerado em PDF (arquivo)' })
  async emitir(
    @Param('idInscricao') idInscricao: number,
    @User('sub') idUsuario: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.emitirCertificadoUseCase.execute(idInscricao, idUsuario);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificado.pdf',
    });
    res.end(pdfBuffer);
  }

  @Get('publico/:numeroSerie')
  @ApiOperation({ summary: 'Validar certificado público pelo número de série' })
  @ApiParam({ name: 'numeroSerie', type: String })
  @ApiResponse({ status: 200, type: CertificadoPublicoResponseDto })
  async validar(@Param('numeroSerie') numeroSerie: string) {
    const certificado = await this.certificadoRepo.findByNumeroSerie(numeroSerie);
    if (!certificado) throw new NotFoundException('Certificado não encontrado');

    return new CertificadoPublicoResponseDto(certificado);
  }
}
