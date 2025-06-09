export class SalaEntity {
  constructor(
    public id: number,
    public asientos: number
  ) {}

  public static fromObject(object: { [key: string]: any }): SalaEntity {
    const { id, asientos } = object;

    if (!id) throw 'Id is required';
    if (asientos === undefined || asientos === null) throw 'Asientos is required';

    return new SalaEntity(id, asientos);
  }
}
