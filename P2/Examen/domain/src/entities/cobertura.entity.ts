export class Cobertura {
    id: number;
    tipo: string; // Tipo de cobertura (total, parcial, contra robo, etc.)
    seguro: string; // Tipo de seguro asociado a la cobertura
    deducible: number; // Deducible asociado a la cobertura

    constructor(partial?: Partial<Cobertura>) {
        Object.assign(this, partial);
    }
}
