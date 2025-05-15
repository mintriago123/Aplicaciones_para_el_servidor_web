import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TareaProgramada {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  fechaEjecucion!: Date;

  @Column()
  tipo!: string;
}
