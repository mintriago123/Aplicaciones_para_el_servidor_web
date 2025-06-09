export class CreateReservaAsientoDto {

  private constructor(
    public readonly idFuncion: number,
    public readonly idAsiento: number,
    public readonly idTicket: number
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateReservaAsientoDto?] {
    const { idFuncion, idAsiento, idTicket } = props;

    if (!idFuncion) return ['IdFuncion is required', undefined];
    if (!idAsiento) return ['IdAsiento is required', undefined];
    if (!idTicket) return ['IdTicket is required', undefined];

    return [undefined, new CreateReservaAsientoDto(idFuncion, idAsiento, idTicket)];
  }
}
