import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Plaga } from "./Plaga";

@Entity()
export class Cultivo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  tipo!: string;

  @OneToMany(() => Plaga, plaga => plaga.cultivo)
  plagas!: Plaga[];
}
