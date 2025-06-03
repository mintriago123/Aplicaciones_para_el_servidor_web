import { DatosAExportarRepository } from "../../../domain/datosExportar/DatosAExportarRepository";
import { DatosAExportar } from "../../../domain/datosExportar/DatosAExportar";
import { AppDataSource } from "../../../interfaces/database/data-source";
import { DatosAExportarORM } from "../../orm/entities/DatosAExportarORM";

export class DatosAExportarRepositoryImpl implements DatosAExportarRepository {
  private repo = AppDataSource.getRepository(DatosAExportarORM);

  async save(dato: DatosAExportar): Promise<DatosAExportar> {
    const ormEntity = this.repo.create({
      ...dato,
      id: undefined, // evitar conflictos si es null
    });
    const saved = await this.repo.save(ormEntity);
    return new DatosAExportar(
      saved.id,
      saved.fechaExportacion,
      saved.tipoDato,
      saved.formato,
      saved.contenido
    );
  }

  async findAll(): Promise<DatosAExportar[]> {
    const data = await this.repo.find();
    return data.map(
      (d) =>
        new DatosAExportar(d.id, d.fechaExportacion, d.tipoDato, d.formato, d.contenido)
    );
  }

  async findById(id: number): Promise<DatosAExportar | null> {
    const d = await this.repo.findOneBy({ id });
    if (!d) return null;
    return new DatosAExportar(d.id, d.fechaExportacion, d.tipoDato, d.formato, d.contenido);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
