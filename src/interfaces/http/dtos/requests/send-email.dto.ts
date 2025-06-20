import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Dúvida sobre o curso' })
  @IsNotEmpty({ message: 'O assunto é obrigatório' })
  @IsString()
  @MinLength(3, { message: 'O assunto deve ter pelo menos 3 caracteres' })
  assunto: string;

  @ApiProperty({ example: 'Olá, gostaria de saber mais sobre o conteúdo do curso.' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória' })
  @IsString()
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  mensagem: string;
}
