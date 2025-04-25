import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inscricoes')
export class Inscricao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUser: number;

  @Column()
  idModulo: number;

  @Column({ default: 0 })
  statusInscricao: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataInscricao: Date;
}