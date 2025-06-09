export class AsientoEntity {
  constructor(
    public id: number,
    public idSala: number,
    public fila: string,
    public numero: number
  ) {}

  get etiqueta() {
    return `${this.fila}${this.numero}`;
  }

  public static fromObject(object: { [key: string]: any }): AsientoEntity {
    const { id, idSala, fila, numero } = object;

    if (!id) throw 'Id is required';
    if (!idSala) throw 'IdSala is required';
    if (!fila) throw 'Fila is required';
    if (numero === undefined || numero === null) throw 'Numero is required';

    return new AsientoEntity(id, idSala, fila, numero);
  }
}
