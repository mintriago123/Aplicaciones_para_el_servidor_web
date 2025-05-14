import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Notificacion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    msj!: string;

    @Column("boolean")
    enviada!: boolean;
}
