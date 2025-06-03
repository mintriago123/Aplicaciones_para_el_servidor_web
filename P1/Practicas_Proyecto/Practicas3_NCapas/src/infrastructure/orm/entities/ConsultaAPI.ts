import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Plaga } from "./Plaga";
import { DatosAExportarORM } from "./DatosAExportarORM";

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

  @OneToMany(() => DatosAExportarORM, datos => datos.consultaAPI)
  datosExportados!: DatosAExportarORM[];
}
