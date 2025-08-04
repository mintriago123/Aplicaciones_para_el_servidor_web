export class Vehiculo {
  id: number;
  tipo: string; // sedan, camioneta, SUV, hatchback, deportivo, etc.
  marca: string;
  modelo: string;
  anoFabricacion: number;

  constructor(partial?: Partial<Vehiculo>) {
    Object.assign(this, partial);
  }
}
