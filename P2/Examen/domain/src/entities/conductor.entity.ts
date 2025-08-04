export class Conductor {
    id: number;
    nombre: string;
    apellido: string;
    email: string;

    constructor(partial?: Partial<Conductor>) {
        Object.assign(this, partial);
    }
}
