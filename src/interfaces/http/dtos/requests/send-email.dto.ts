import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'O assunto é obrigatório' })
  @IsString()
  @MinLength(3, { message: 'O assunto deve ter pelo menos 3 caracteres' })
  assunto: string;

  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @IsString()
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  mensagem: string;
}