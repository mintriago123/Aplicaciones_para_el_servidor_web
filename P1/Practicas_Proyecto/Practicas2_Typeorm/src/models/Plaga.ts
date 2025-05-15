import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ConsultaAPI } from "./ConsultaAPI";
import { Cultivo } from "./Cultivo";

@Entity()
export class Plaga {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  nivel!: string;

  @ManyToOne(() => ConsultaAPI, consulta => consulta.plagas)
  consultaAPI!: ConsultaAPI;

  @ManyToOne(() => Cultivo, cultivo => cultivo.plagas)
  cultivo!: Cultivo;
}
