export class TicketEntity {
  constructor(
    public id: number,
    public idFuncion: number,
    public precio: number,
    public canjeado: boolean
  ) {}

  get estaCanjeado() {
    return this.canjeado;
  }

  public static fromObject(object: { [key: string]: any }): TicketEntity {
    const { id, idFuncion, precio, canjeado } = object;

    if (!id) throw 'Id is required';
    if (!idFuncion) throw 'IdFuncion is required';
    if (precio === undefined || precio === null) throw 'Precio is required';
    if (canjeado === undefined || canjeado === null) throw 'Canjeado is required';

    return new TicketEntity(id, idFuncion, precio, canjeado);
  }
}
