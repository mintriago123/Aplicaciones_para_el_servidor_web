export class CreateVehiculoDto {
    tipo: string; // sedan, camioneta, SUV, hatchback, deportivo, etc.
    marca: string;
    modelo: string;
    año: number;
}

export class UpdateVehiculoDto {
    tipo?: string;
    marca?: string;
    modelo?: string;
    año?: number;
}
