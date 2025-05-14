import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TareaProgramada } from "./TareaProgramada";
import { HistorialClima } from "./HistorialClima";

@Entity()
export class ConsultaAPI {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => TareaProgramada, tarea => tarea.consultas)
    tarea!: TareaProgramada;

    @ManyToOne(() => HistorialClima, clima => clima.consultas)
    clima!: HistorialClima;

    @Column("datetime")
    realizadaEn!: Date;
}
    