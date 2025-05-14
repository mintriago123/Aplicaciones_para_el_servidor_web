import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ConsultaAPI } from "./ConsultaAPI";

@Entity()
export class HistorialClima {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("float")
    temperatura!: number;

    @Column("float")
    humedad!: number;

    @Column("float")
    viento!: number;

    @Column("datetime")
    fecha!: Date;

    @Column()
    ubicacion!: string;

    @OneToMany(() => ConsultaAPI, consulta => consulta.clima)
    consultas!: ConsultaAPI[];
}
