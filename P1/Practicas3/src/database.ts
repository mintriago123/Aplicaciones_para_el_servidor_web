import { appdataSource } from './data-source'
import 'reflect-metadata'

export const initDatabase = async () => {
    try {
        await appdataSource.initialize(); // ← FALTABA ESTE await
        console.log("Base de datos inicializada correctamente");
        return appdataSource;
    } catch (ex) {
        console.log("Error al inicializar la base de datos");
        throw ex;
    }
}
