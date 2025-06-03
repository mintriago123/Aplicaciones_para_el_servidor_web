import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
config();

import { ConsultaAPI } from "../../infrastructure/orm/entities/ConsultaAPI";
import { Plaga } from "../../infrastructure/orm/entities/Plaga";
import { TareaProgramada } from "../../infrastructure/orm/entities/TareaProgramada";
import { Cultivo } from "../../infrastructure/orm/entities/Cultivo";
import { DatosAExportarORM } from "../../infrastructure/orm/entities/DatosAExportarORM";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [ConsultaAPI, Plaga, TareaProgramada, Cultivo, DatosAExportarORM],
  subscribers: [],
  migrations: [],
});
