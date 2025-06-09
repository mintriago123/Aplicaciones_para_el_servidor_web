export class UpdateFuncionDto {

  private constructor(
    public readonly id: number,
    public readonly idPelicula?: number,
    public readonly idSala?: number,
    public readonly idIdioma?: number,
    public readonly fecha?: Date,
    public readonly asientosOcupados?: number
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.idPelicula !== undefined) returnObj.idPelicula = this.idPelicula;
    if (this.idSala !== undefined) returnObj.idSala = this.idSala;
    if (this.idIdioma !== undefined) returnObj.idIdioma = this.idIdioma;
    if (this.fecha) returnObj.fecha = this.fecha;
    if (this.asientosOcupados !== undefined) returnObj.asientosOcupados = this.asientosOcupados;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateFuncionDto?] {
    const { id, idPelicula, idSala, idIdioma, fecha, asientosOcupados } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    let fechaValida = fecha;
    if (fecha) {
      fechaValida = new Date(fecha);
      if (fechaValida.toString() === 'Invalid Date') return ['Fecha must be a valid date'];
    }

    return [undefined, new UpdateFuncionDto(id, idPelicula, idSala, idIdioma, fechaValida, asientosOcupados)];
  }
}
