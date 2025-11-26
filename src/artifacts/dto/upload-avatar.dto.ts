import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarResponseDto {
  @ApiProperty({ description: 'Identificador único do avatar' })
  avatarId: string;

  @ApiProperty({ description: 'Identificador do usuário' })
  userId: string;

  @ApiProperty({ description: 'Chave do arquivo no bucket S3' })
  s3Key: string;

  @ApiProperty({ description: 'URL pública ou assinada para acessar o avatar' })
  url: string;

  @ApiProperty({ description: 'MIME type do arquivo' })
  mimeType: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  fileSize: number;

  @ApiProperty({ description: 'Data de criação do registro', type: String })
  createdAt: string;

  @ApiProperty({ example: 'Upload realizado com sucesso' })
  message: string;
}
