import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvaliacaoDto {
  @ApiProperty({ example: 4, description: 'Nova nota de 1 a 5' })
  nota: number;

  @ApiProperty({ required: false, example: 'Gostei, mas poderia melhorar.', description: 'Comentário atualizado' })
  comentario?: string;
}
