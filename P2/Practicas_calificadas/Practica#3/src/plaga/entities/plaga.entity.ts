import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plaga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  regionAfectada: string;

  @Column()
  nivelRiesgo: string;
}
