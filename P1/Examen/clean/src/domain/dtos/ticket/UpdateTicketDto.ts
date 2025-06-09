export class UpdateTicketDto {

  private constructor(
    public readonly id: number,
    public readonly idFuncion?: number,
    public readonly precio?: number,
    public readonly canjeado?: boolean
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.idFuncion !== undefined) returnObj.idFuncion = this.idFuncion;
    if (this.precio !== undefined) returnObj.precio = this.precio;
    if (this.canjeado !== undefined) returnObj.canjeado = this.canjeado;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateTicketDto?] {
    const { id, idFuncion, precio, canjeado } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    return [undefined, new UpdateTicketDto(id, idFuncion, precio, canjeado)];
  }
}
