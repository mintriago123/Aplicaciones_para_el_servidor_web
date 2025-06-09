export class UpdateAsientoDto {

  private constructor(
    public readonly id: number,
    public readonly idSala?: number,
    public readonly fila?: string,
    public readonly numero?: number
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.idSala !== undefined) returnObj.idSala = this.idSala;
    if (this.fila) returnObj.fila = this.fila;
    if (this.numero !== undefined) returnObj.numero = this.numero;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateAsientoDto?] {
    const { id, idSala, fila, numero } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    return [undefined, new UpdateAsientoDto(id, idSala, fila, numero)];
  }
}
