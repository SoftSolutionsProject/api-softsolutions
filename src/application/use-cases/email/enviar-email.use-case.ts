import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailModel } from 'src/domain/models/email.model';

@Injectable()
export class EnviarEmailUseCase {
  async execute(dto: EmailModel): Promise<{ message: string }> {
    // Validação dos campos obrigatórios
    if (!dto.nome || !dto.email || !dto.assunto || !dto.mensagem) {
      throw new BadRequestException('Todos os campos são obrigatórios');
    }

    // Validação do formato do email
    if (!this.validarEmail(dto.email)) {
      throw new BadRequestException('Email inválido');
    }

    // Validação do comprimento mínimo da mensagem
    if (dto.mensagem.length < 10) {
      throw new BadRequestException('A mensagem deve ter pelo menos 10 caracteres');
    }

    if (!process.env.EMAIL_SUPPORT_USER || !process.env.EMAIL_SUPPORT_PASS || !process.env.EMAIL_SUPPORT_DESTINATION) {
      throw new InternalServerErrorException('Configurações de e-mail não definidas.');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SUPPORT_USER,
        pass: process.env.EMAIL_SUPPORT_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `${dto.nome} <${process.env.EMAIL_SUPPORT_USER}>`,
      replyTo: dto.email,
      to: process.env.EMAIL_SUPPORT_DESTINATION,
      subject: `Contato - ${dto.assunto}`,
      text: `Mensagem de: ${dto.nome} <${dto.email}>\n\n${dto.mensagem}`,
    });

    return { message: 'E-mail enviado com sucesso!' };
  }

  private validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}