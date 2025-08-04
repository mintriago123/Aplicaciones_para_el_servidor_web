import { ApiProperty } from '@nestjs/swagger';

export class CreateConductorDto {
    @ApiProperty({
        description: 'Nombre del conductor',
        example: 'Juan',
        minLength: 1
    })
    nombre: string;

    @ApiProperty({
        description: 'Apellido del conductor',
        example: 'Pérez',
        minLength: 1
    })
    apellido: string;

    @ApiProperty({
        description: 'Email del conductor (debe ser único)',
        example: 'juan.perez@email.com',
        format: 'email'
    })
    email: string;
}
