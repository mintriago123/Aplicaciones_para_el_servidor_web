import { DatosAExportarRepository } from "../../../domain/datosExportar/DatosAExportarRepository";

export class GetDatosById {
  constructor(private repo: DatosAExportarRepository) {}

  async execute(id: number) {
    return await this.repo.findById(id);
  }
}