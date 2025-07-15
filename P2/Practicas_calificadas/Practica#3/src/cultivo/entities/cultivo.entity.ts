import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cultivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  temporada: string;

  @Column()
  region: string;
}