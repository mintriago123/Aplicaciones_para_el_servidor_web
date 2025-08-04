import { ApiProperty } from '@nestjs/swagger';

export class Conductor {
    @ApiProperty({
        description: 'ID único del conductor',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Nombre del conductor',
        example: 'Juan'
    })
    nombre: string;

    @ApiProperty({
        description: 'Apellido del conductor',
        example: 'Pérez'
    })
    apellido: string;

    @ApiProperty({
        description: 'Email del conductor',
        example: 'juan.perez@email.com'
    })
    email: string;
}
