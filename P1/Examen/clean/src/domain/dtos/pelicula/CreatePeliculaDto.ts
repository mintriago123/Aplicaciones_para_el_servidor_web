export class CreatePeliculaDto {

  private constructor(
    public readonly titulo: string,
    public readonly clasificacionEdad: number,
    public readonly estrenada: boolean
  ) {}

  static create(props: { [key: string]: any }): [string?, CreatePeliculaDto?] {
    const { titulo, clasificacionEdad, estrenada } = props;

    if (!titulo) return ['Titulo is required', undefined];
    if (clasificacionEdad === undefined || clasificacionEdad === null) return ['ClasificacionEdad is required', undefined];
    if (estrenada === undefined || estrenada === null) return ['Estrenada is required', undefined];

    return [undefined, new CreatePeliculaDto(titulo, clasificacionEdad, estrenada)];
  }
}
