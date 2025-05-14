import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { HistorialPlaga } from "./HistorialPlaga";

@Entity()
export class Plaga {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    especie!: string;

    @OneToMany(() => HistorialPlaga, historial => historial.plaga)
    historial!: HistorialPlaga[];
}
