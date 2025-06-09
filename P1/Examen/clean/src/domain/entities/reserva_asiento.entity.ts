export class ReservaAsientoEntity {
  constructor(
    public id: number,
    public idFuncion: number,
    public idAsiento: number,
    public idTicket: number
  ) {}

  public static fromObject(object: { [key: string]: any }): ReservaAsientoEntity {
    const { id, idFuncion, idAsiento, idTicket } = object;

    if (!id) throw 'Id is required';
    if (!idFuncion) throw 'IdFuncion is required';
    if (!idAsiento) throw 'IdAsiento is required';
    if (!idTicket) throw 'IdTicket is required';

    return new ReservaAsientoEntity(id, idFuncion, idAsiento, idTicket);
  }
}
