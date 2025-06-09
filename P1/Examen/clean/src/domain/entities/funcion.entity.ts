export class FuncionEntity {
  constructor(
    public id: number,
    public idPelicula: number,
    public idSala: number,
    public idIdioma: number,
    public fecha: Date,
    public asientosOcupados: number
  ) {}

  get disponibilidad() {
    return this.asientosOcupados >= 0;
  }

  public static fromObject(object: { [key: string]: any }): FuncionEntity {
    const { id, idPelicula, idSala, idIdioma, fecha, asientosOcupados } = object;

    if (!id) throw 'Id is required';
    if (!idPelicula) throw 'IdPelicula is required';
    if (!idSala) throw 'IdSala is required';
    if (!idIdioma) throw 'IdIdioma is required';
    if (!fecha) throw 'Fecha is required';
    if (asientosOcupados === undefined || asientosOcupados === null) throw 'AsientosOcupados is required';

    const fechaValida = new Date(fecha);
    if (isNaN(fechaValida.getTime())) throw 'Fecha is not a valid date';

    return new FuncionEntity(id, idPelicula, idSala, idIdioma, fechaValida, asientosOcupados);
  }
}
