import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '../dtos/send-email.dto';

@Injectable()
export class EmailService {
  async enviarEmail(dto: SendEmailDto): Promise<{ message: string }> {
    const { nome, email, assunto, mensagem } = dto;

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
      from: `${nome} <${process.env.EMAIL_SUPPORT_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_SUPPORT_DESTINATION,
      subject: `Contato - ${assunto}`,
      text: `Mensagem de: ${nome} <${email}>\n\n${mensagem}`,
    });

    return { message: 'E-mail enviado com sucesso!' };
  }
}