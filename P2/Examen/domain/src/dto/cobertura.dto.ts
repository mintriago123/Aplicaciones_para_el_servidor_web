export class CreateCoberturaDto {
    tipo: string;
    seguro: string;
    deducible: number;
}

export class UpdateCoberturaDto {
    tipo?: string;
    seguro?: string;
    deducible?: number;
}
