    import { User } from "./models/user";
    import { View } from "./models/view";
    import 'reflect-metadata';
    import { DataSource } from "typeorm";

    export const appdataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "hola12p12",
        database: "postgres",
        synchronize: true,
        logging: true,
        entities: [User,View],
        subscribers: [],
        migrations: [],

    })

