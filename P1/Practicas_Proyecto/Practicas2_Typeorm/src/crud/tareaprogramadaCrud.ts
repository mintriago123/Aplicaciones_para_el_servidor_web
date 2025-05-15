
import { appdataSource } from "../data-source";
import { TareaProgramada } from "../models/TareaProgramada";

export const insertTareaProgramada = async (data: Partial<TareaProgramada>) => {
    const item = appdataSource.manager.create(TareaProgramada, data);
    return await appdataSource.manager.save(item);
}

export const obtenerTareaProgramadas = async () => {
    return await appdataSource.manager.find(TareaProgramada);
}

export const obtenerTareaProgramada = async (id: number) => {
    return await appdataSource.manager.findOne(TareaProgramada, {
        where: { id }
    });
}

export const actualizarTareaProgramada = async (id: number, data: Partial<TareaProgramada>) => {
    const item = await obtenerTareaProgramada(id);
    if (item) {
        Object.assign(item, data);
        return await appdataSource.manager.save(item);
    }
    return null;
}

export const eliminarTareaProgramada = async (id: number) => {
    const item = await obtenerTareaProgramada(id);
    if (item) {
        return await appdataSource.manager.remove(item);
    }
    return null;
}
