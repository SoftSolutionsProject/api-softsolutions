import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Modulo } from '../modulo/modulo.entity';
import { ProgressoAula } from '../inscricao/progresso-aula.entity';

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

  @OneToMany(() => ProgressoAula, progresso => progresso.aula)
  progressos: ProgressoAula[];
}