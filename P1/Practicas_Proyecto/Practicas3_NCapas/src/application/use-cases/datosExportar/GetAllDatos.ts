import { DatosAExportarRepository } from "../../../domain/datosExportar/DatosAExportarRepository";

export class GetAllDatos {
  constructor(private repo: DatosAExportarRepository) {}

  async execute() {
    return await this.repo.findAll();
  }
}
