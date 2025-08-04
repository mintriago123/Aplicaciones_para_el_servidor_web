export class CreateConductorDto {
    nombre: string;
    apellido: string;
    email: string;
}

export class UpdateConductorDto {
    nombre?: string;
    apellido?: string;
    email?: string;
}
