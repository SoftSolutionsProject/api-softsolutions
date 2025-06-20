import { ApiProperty } from '@nestjs/swagger';

export class CreateAvaliacaoDto {
  @ApiProperty({ example: 5, description: 'Nota de 1 a 5' })
  nota: number;

  @ApiProperty({ required: false, example: 'Ótimo curso!', description: 'Comentário opcional' })
  comentario?: string;

  @ApiProperty({ example: 1, description: 'ID do curso a ser avaliado' })
  cursoId: number;
}
