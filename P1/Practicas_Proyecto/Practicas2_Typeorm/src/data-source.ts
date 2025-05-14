import 'reflect-metadata';
import { DataSource } from "typeorm";
import { ConsultaAPI } from "./models/ConsultaAPI";
import { HistorialClima } from "./models/HistorialClima";
import { HistorialPlaga } from "./models/HistorialPlaga";
import { Plaga } from "./models/Plaga";
import { TareaProgramada } from "./models/TareaProgramada";
import { Notificacion } from './models/Notificacion';


    export const appdataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "hola12p12",
        database: "postgres",
        synchronize: true,
        logging: true,
        entities: [ConsultaAPI, HistorialClima, HistorialPlaga, Plaga, TareaProgramada, Notificacion],
        subscribers: [],
        migrations: [],

    })

