import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EnviarEmailUseCase } from 'src/application/use-cases/email/enviar-email.use-case';
import { SendEmailDto } from '../dtos/requests/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly enviarEmailUseCase: EnviarEmailUseCase) {}

  @Post('suporte')
  @UsePipes(new ValidationPipe({ transform: true }))
  async enviarEmail(@Body() dto: SendEmailDto) {
    return this.enviarEmailUseCase.execute(dto);
  }
}