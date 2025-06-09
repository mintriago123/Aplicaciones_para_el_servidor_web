export class UpdateIdiomaDto {

  private constructor(
    public readonly id: number,
    public readonly nombre?: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre) returnObj.nombre = this.nombre;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateIdiomaDto?] {
    const { id, nombre } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    return [undefined, new UpdateIdiomaDto(id, nombre)];
  }
}
