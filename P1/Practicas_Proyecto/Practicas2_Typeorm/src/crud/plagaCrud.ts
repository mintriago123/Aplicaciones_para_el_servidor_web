
import { appdataSource } from "../data-source";
import { Plaga } from "../models/Plaga";

export const insertPlaga = async (data: Partial<Plaga>) => {
    const item = appdataSource.manager.create(Plaga, data);
    return await appdataSource.manager.save(item);
}

export const obtenerPlagas = async () => {
    return await appdataSource.manager.find(Plaga);
}

export const obtenerPlaga = async (id: number) => {
    return await appdataSource.manager.findOne(Plaga, {
        where: { id }
    });
}

export const actualizarPlaga = async (id: number, data: Partial<Plaga>) => {
    const item = await obtenerPlaga(id);
    if (item) {
        Object.assign(item, data);
        return await appdataSource.manager.save(item);
    }
    return null;
}

export const eliminarPlaga = async (id: number) => {
    const item = await obtenerPlaga(id);
    if (item) {
        return await appdataSource.manager.remove(item);
    }
    return null;
}
