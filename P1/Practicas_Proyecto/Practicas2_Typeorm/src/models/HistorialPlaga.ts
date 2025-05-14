import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Plaga } from "./Plaga";

@Entity()
export class HistorialPlaga {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    imagen!: string;

    @Column("datetime")
    fecha!: Date;

    @Column()
    ubicacion!: string;

    @ManyToOne(() => Plaga, plaga => plaga.historial)
    plaga!: Plaga;
}
