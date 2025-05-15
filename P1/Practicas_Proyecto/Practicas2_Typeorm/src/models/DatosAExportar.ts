import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { ConsultaAPI } from "./ConsultaAPI";
import { Cultivo } from "./Cultivo";
import { Plaga } from "./Plaga";

@Entity()
export class DatosAExportar {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    fechaExportacion!: Date;

    @Column()
    tipoDato!: string; // Ej: 'cultivo', 'plaga', 'consultaAPI'

    @Column()
    formato!: string; // Ej: 'csv', 'pdf', 'json'

    @Column({ nullable: true, type: "text" })
    contenido?: string;

    // Relación opcional con las entidades fuente
    @ManyToOne(() => Cultivo, { nullable: true })
    cultivo?: Cultivo;

    @ManyToOne(() => Plaga, { nullable: true })
    plaga?: Plaga;

    @ManyToOne(() => ConsultaAPI, { nullable: true })
    consultaAPI?: ConsultaAPI;
}
