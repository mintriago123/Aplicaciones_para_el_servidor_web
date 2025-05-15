import 'reflect-metadata';
import { DataSource } from "typeorm";
import { ConsultaAPI } from "./models/ConsultaAPI";
import { Plaga } from "./models/Plaga";
import { TareaProgramada } from "./models/TareaProgramada";
import { Cultivo } from "./models/Cultivo";
import { DatosAExportar } from "./models/DatosAExportar";


    export const appdataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "hola12p12",
        database: "bdpracticasproyecto2",
        synchronize: true,
        logging: true,
        entities: [ConsultaAPI, Plaga, TareaProgramada, Cultivo, DatosAExportar],
        subscribers: [],
        migrations: [],

    })

