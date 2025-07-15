import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DatoAexportar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  producto: string;

  @Column()
  cantidad: number;

  @Column()
  destino: string;

  @Column()
  fechaExportacion: string;
}