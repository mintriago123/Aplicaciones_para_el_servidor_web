export class CreateTicketDto {

  private constructor(
    public readonly idFuncion: number,
    public readonly precio: number,
    public readonly canjeado: boolean
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateTicketDto?] {
    const { idFuncion, precio, canjeado } = props;

    if (!idFuncion) return ['IdFuncion is required', undefined];
    if (precio === undefined || precio === null) return ['Precio is required', undefined];
    if (canjeado === undefined || canjeado === null) return ['Canjeado is required', undefined];

    return [undefined, new CreateTicketDto(idFuncion, precio, canjeado)];
  }
}
