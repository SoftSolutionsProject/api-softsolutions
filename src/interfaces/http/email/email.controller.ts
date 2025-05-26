import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from '../../../application/email/dtos/send-email.dto';
import { EmailService } from '../../../application/email/use-cases/email.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) { }

  @Post('suporte')
  @ApiOperation({ summary: 'Enviar e-mail de suporte' })
  @ApiBody({ type: SendEmailDto })
  @ApiResponse({ status: 201, description: 'E-mail enviado com sucesso' })
  async enviarEmail(@Body() dto: SendEmailDto) {
    return this.service.enviarEmail(dto);
  }
}