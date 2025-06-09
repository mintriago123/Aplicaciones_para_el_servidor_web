export class PeliculaEntity {
  constructor(
    public id: number,
    public titulo: string,
    public clasificacionEdad: number,
    public estrenada: boolean
  ) {}

  get esCartelera() {
    return this.estrenada;
  }

  public static fromObject(object: { [key: string]: any }): PeliculaEntity {
    const { id, titulo, clasificacionEdad, estrenada } = object;
    if (!id) throw 'Id is required';
    if (!titulo) throw 'Titulo is required';
    if (clasificacionEdad === undefined || clasificacionEdad === null) throw 'ClasificacionEdad is required';
    if (estrenada === undefined || estrenada === null) throw 'Estrenada is required';

    return new PeliculaEntity(id, titulo, clasificacionEdad, estrenada);
  }
}
