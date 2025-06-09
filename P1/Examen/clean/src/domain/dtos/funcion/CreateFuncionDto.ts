export class CreateFuncionDto {

  private constructor(
    public readonly idPelicula: number,
    public readonly idSala: number,
    public readonly idIdioma: number,
    public readonly fecha: Date,
    public readonly asientosOcupados: number
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateFuncionDto?] {
    const { idPelicula, idSala, idIdioma, fecha, asientosOcupados } = props;

    if (!idPelicula) return ['IdPelicula is required', undefined];
    if (!idSala) return ['IdSala is required', undefined];
    if (!idIdioma) return ['IdIdioma is required', undefined];
    if (!fecha) return ['Fecha is required', undefined];

    const fechaValida = new Date(fecha);
    if (isNaN(fechaValida.getTime())) return ['Fecha is not a valid date', undefined];

    if (asientosOcupados === undefined || asientosOcupados === null) return ['AsientosOcupados is required', undefined];

    return [undefined, new CreateFuncionDto(idPelicula, idSala, idIdioma, fechaValida, asientosOcupados)];
  }
}
