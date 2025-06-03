export class DatosAExportar {
  constructor(
    public readonly id: number | null,
    public readonly fechaExportacion: Date,
    public readonly tipoDato: string,
    public readonly formato: string,
    public readonly contenido?: string
  ) {}
}
