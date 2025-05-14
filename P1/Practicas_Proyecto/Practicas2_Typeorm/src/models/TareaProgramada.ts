import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ConsultaAPI } from "./ConsultaAPI";

@Entity()
export class TareaProgramada {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int")
    frecuencia!: number;

    @Column("datetime")
    ultimaEjecucion!: Date;

    @OneToMany(() => ConsultaAPI, consulta => consulta.tarea)
    consultas!: ConsultaAPI[];
}
