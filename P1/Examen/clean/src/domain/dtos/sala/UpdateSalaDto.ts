export class UpdateSalaDto {

  private constructor(
    public readonly id: number,
    public readonly asientos?: number
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.asientos !== undefined) returnObj.asientos = this.asientos;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateSalaDto?] {
    const { id, asientos } = props;

    if (!id || isNaN(Number(id))) return ['Id must be a valid number'];

    return [undefined, new UpdateSalaDto(id, asientos)];
  }
}
