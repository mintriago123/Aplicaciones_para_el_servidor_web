import { DatosAExportarRepository } from "../../../domain/datosExportar/DatosAExportarRepository";
import { DatosAExportar } from "../../../domain/datosExportar/DatosAExportar";

export class CreateDato {
  constructor(private repo: DatosAExportarRepository) {}

  async execute(input: {
    tipoDato: string;
    formato: string;
    contenido?: string;
  }): Promise<DatosAExportar> {
    const dato = new DatosAExportar(
      null,
      new Date(),
      input.tipoDato,
      input.formato,
      input.contenido
    );
    return await this.repo.save(dato);
  }
}
