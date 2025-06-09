export class IdiomaEntity {
  constructor(
    public id: number,
    public nombre: string
  ) {}

  public static fromObject(object: { [key: string]: any }): IdiomaEntity {
    const { id, nombre } = object;

    if (!id) throw 'Id is required';
    if (!nombre) throw 'Nombre is required';

    return new IdiomaEntity(id, nombre);
  }
}
