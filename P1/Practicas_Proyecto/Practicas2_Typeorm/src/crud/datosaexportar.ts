import { appdataSource } from "../data-source";
import { DatosAExportar } from "../models/DatosAExportar";
import { Cultivo } from "../models/Cultivo";
import { Plaga } from "../models/Plaga";
import { ConsultaAPI } from "../models/ConsultaAPI";

// Crear una nueva exportación
export const insertExportacion = async (
    tipoDato: "cultivo" | "plaga" | "consultaAPI",
    formato: "json" | "csv" | "pdf",
    contenido: string,
    idRelacionado: number
) => {
    const exportacion = new DatosAExportar();
    exportacion.tipoDato = tipoDato;
    exportacion.formato = formato;
    exportacion.contenido = contenido;

    if (tipoDato === "cultivo") {
        const cultivo = await appdataSource.manager.findOne(Cultivo, { where: { id: idRelacionado } });
        if (!cultivo) throw new Error("Cultivo no encontrado");
        exportacion.cultivo = cultivo;
    } else if (tipoDato === "plaga") {
        const plaga = await appdataSource.manager.findOne(Plaga, { where: { id: idRelacionado } });
        if (!plaga) throw new Error("Plaga no encontrada");
        exportacion.plaga = plaga;
    } else if (tipoDato === "consultaAPI") {
        const consulta = await appdataSource.manager.findOne(ConsultaAPI, { where: { id: idRelacionado } });
        if (!consulta) throw new Error("Consulta API no encontrada");
        exportacion.consultaAPI = consulta;
    }

    return await appdataSource.manager.save(exportacion);
};

// Obtener todas las exportaciones
export const obtenerExportaciones = async () => {
    return await appdataSource.manager.find(DatosAExportar, {
        relations: ["cultivo", "plaga", "consultaAPI"],
        order: { fechaExportacion: "DESC" }
    });
};

// Obtener una exportación por ID
export const obtenerExportacion = async (id: number) => {
    return await appdataSource.manager.findOne(DatosAExportar, {
        where: { id },
        relations: ["cultivo", "plaga", "consultaAPI"]
    });
};

// Actualizar una exportación
export const actualizarExportacion = async (
    id: number,
    formato: string,
    contenido: string
) => {
    const exportacion = await obtenerExportacion(id);
    if (exportacion) {
        exportacion.formato = formato;
        exportacion.contenido = contenido;
        return await appdataSource.manager.save(exportacion);
    }
    return null;
};

// Eliminar una exportación
export const eliminarExportacion = async (id: number) => {
    const exportacion = await obtenerExportacion(id);
    if (exportacion) {
        return await appdataSource.manager.remove(exportacion);
    }
    return null;
};
