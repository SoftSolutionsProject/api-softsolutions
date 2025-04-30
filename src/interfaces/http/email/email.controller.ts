import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from '../../../application/email/dtos/send-email.dto';
import { EmailService } from '../../../application/email/use-cases/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('suporte')
  async enviarEmail(@Body() dto: SendEmailDto) {
    return this.service.enviarEmail(dto);
  }
}