export class CreateAsientoDto {

  private constructor(
    public readonly idSala: number,
    public readonly fila: string,
    public readonly numero: number
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateAsientoDto?] {
    const { idSala, fila, numero } = props;

    if (!idSala) return ['IdSala is required', undefined];
    if (!fila) return ['Fila is required', undefined];
    if (numero === undefined || numero === null) return ['Numero is required', undefined];

    return [undefined, new CreateAsientoDto(idSala, fila, numero)];
  }
}
