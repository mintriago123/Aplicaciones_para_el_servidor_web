
import { appdataSource } from "../data-source";
import { ConsultaAPI } from "../models/ConsultaAPI";

export const insertConsultaAPI = async (data: Partial<ConsultaAPI>) => {
    const item = appdataSource.manager.create(ConsultaAPI, data);
    return await appdataSource.manager.save(item);
}

export const obtenerConsultaAPIs = async () => {
    return await appdataSource.manager.find(ConsultaAPI);
}

export const obtenerConsultaAPI = async (id: number) => {
    return await appdataSource.manager.findOne(ConsultaAPI, {
        where: { id }
    });
}

export const actualizarConsultaAPI = async (id: number, data: Partial<ConsultaAPI>) => {
    const item = await obtenerConsultaAPI(id);
    if (item) {
        Object.assign(item, data);
        return await appdataSource.manager.save(item);
    }
    return null;
}

export const eliminarConsultaAPI = async (id: number) => {
    const item = await obtenerConsultaAPI(id);
    if (item) {
        return await appdataSource.manager.remove(item);
    }
    return null;
}
