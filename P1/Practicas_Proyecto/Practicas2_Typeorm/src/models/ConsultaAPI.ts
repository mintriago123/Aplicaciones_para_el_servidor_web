import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Plaga } from "./Plaga";
import { DatosAExportar } from "./DatosAExportar";

@Entity()
export class ConsultaAPI {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  endpoint!: string;

  @Column()
  fecha!: Date;

  @OneToMany(() => Plaga, plaga => plaga.consultaAPI)
  plagas!: Plaga[];

  @OneToMany(() => DatosAExportar, datos => datos.consultaAPI)
  datosExportados!: DatosAExportar[];
}
