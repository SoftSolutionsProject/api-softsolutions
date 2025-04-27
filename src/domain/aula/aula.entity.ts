import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Modulo } from '../../../domain/modulo/modulo.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeAula: string;

  @Column()
  tempoAula: number;

  @Column()
  videoUrl: string;

  @Column('simple-array', { nullable: true })
  materialApoio: string[];

  @Column()
  descricaoConteudo: string;

  @ManyToOne(() => Modulo, modulo => modulo.aulas, { onDelete: 'CASCADE' })
  modulo: Modulo;
}