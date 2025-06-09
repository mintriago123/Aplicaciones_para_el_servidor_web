export class CreateSalaDto {

  private constructor(
    public readonly asientos: number
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateSalaDto?] {
    const { asientos } = props;

    if (asientos === undefined || asientos === null) return ['Asientos is required', undefined];

    return [undefined, new CreateSalaDto(asientos)];
  }
}
