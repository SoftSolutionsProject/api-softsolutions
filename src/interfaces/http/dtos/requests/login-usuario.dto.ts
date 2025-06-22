import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDto {
  @ApiProperty({ example: 'lucas@teste.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  senha: string;
}
