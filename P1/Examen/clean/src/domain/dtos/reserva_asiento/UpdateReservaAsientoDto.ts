export class UpdateReservaAsientoDto {

  private constructor(
    public readonly id: number,
    public readonly idFuncion?: number,
    public readonly idAsiento?: number,
    public readonly idTicket?: number
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.idFuncion !== undefined) returnObj.idFuncion = this.idFuncion;
    if (this.idAsiento !== undefined) returnObj.idAsiento = this.idAsiento;
    if (this.idTicket !== undefined) returnObj.idTicket = this.idTicket;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateReservaAsientoDto?] {
    const { id, idFuncion, idAsiento, idTicket } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    return [undefined, new UpdateReservaAsientoDto(id, idFuncion, idAsiento, idTicket)];
  }
}
