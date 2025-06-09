export class CreateIdiomaDto {

  private constructor(
    public readonly nombre: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateIdiomaDto?] {
    const { nombre } = props;

    if (!nombre) return ['Nombre is required', undefined];

    return [undefined, new CreateIdiomaDto(nombre)];
  }
}
