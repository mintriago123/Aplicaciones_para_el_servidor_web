export class UpdatePeliculaDto {

  private constructor(
    public readonly id: number,
    public readonly titulo?: string,
    public readonly clasificacionEdad?: number,
    public readonly estrenada?: boolean,
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.titulo) returnObj.titulo = this.titulo;
    if (this.clasificacionEdad !== undefined) returnObj.clasificacionEdad = this.clasificacionEdad;
    if (this.estrenada !== undefined) returnObj.estrenada = this.estrenada;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdatePeliculaDto?] {
    const { id, titulo, clasificacionEdad, estrenada } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    return [undefined, new UpdatePeliculaDto(id, titulo, clasificacionEdad, estrenada)];
  }
}
