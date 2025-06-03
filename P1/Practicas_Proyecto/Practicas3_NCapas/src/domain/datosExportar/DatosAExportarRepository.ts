import { DatosAExportar } from "./DatosAExportar";

export interface DatosAExportarRepository {
  save(dato: DatosAExportar): Promise<DatosAExportar>;
  findAll(): Promise<DatosAExportar[]>;
  findById(id: number): Promise<DatosAExportar | null>;
  delete(id: number): Promise<void>;
}
