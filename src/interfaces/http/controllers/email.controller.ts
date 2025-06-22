import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnviarEmailUseCase } from 'src/application/use-cases/email/enviar-email.use-case';
import { SendEmailDto } from '../dtos/requests/send-email.dto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly enviarEmailUseCase: EnviarEmailUseCase) {}

  @Post('suporte')
  @ApiOperation({ summary: 'Enviar email de suporte' })
  @ApiResponse({ status: 201, description: 'Email enviado com sucesso' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async enviarEmail(@Body() dto: SendEmailDto) {
    return this.enviarEmailUseCase.execute(dto);
  }
}
