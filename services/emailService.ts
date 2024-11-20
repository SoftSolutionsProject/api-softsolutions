import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';

interface EmailData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export const enviarEmailSuporte = async (data: EmailData): Promise<void> => {
  const { nome, email, assunto, mensagem } = data;

  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.EMAIL_SUPPORT_USER || !process.env.EMAIL_SUPPORT_PASS || !process.env.EMAIL_SUPPORT_DESTINATION) {
    throw new AppError('Configurações de e-mail ausentes. Verifique as variáveis de ambiente.', 500);
  }

  // Configurar o transportador do Nodemailer para o Gmail
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Servidor SMTP do Gmail
    port: 587, // Porta para conexões TLS
    secure: false, // Use 'false' para TLS
    auth: {
      user: process.env.EMAIL_SUPPORT_USER, // Seu e-mail do Gmail
      pass: process.env.EMAIL_SUPPORT_PASS, // Sua senha de aplicativo do Gmail
    },
  });

  // Testar conexão com o servidor SMTP
  try {
    await transporter.verify();
    console.log('Servidor SMTP do Gmail pronto para envio.');
  } catch (error) {
    console.error('Erro na conexão com o servidor SMTP:', error);
    throw new AppError('Erro na conexão com o servidor SMTP.', 500);
  }

  // Montar o e-mail
  const mailOptions = {
    from: `${nome} <${process.env.EMAIL_SUPPORT_USER}>`, // Remetente
    replyTo: email, // Permite que o suporte responda ao e-mail do usuário
    to: process.env.EMAIL_SUPPORT_DESTINATION, // Destinatário (e-mail do suporte)
    subject: `Contato - ${assunto}`, // Assunto do e-mail
    text: `Mensagem de: ${nome} <${email}>\n\n${mensagem}`, // Corpo do e-mail
  };

  // Enviar o e-mail
  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    throw new AppError('Erro ao enviar o e-mail. Tente novamente mais tarde.', 500);
  }
};
