import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivoDto {
  @ApiProperty({ example: 'Papa' })
  nombre: string;

  @ApiProperty({ example: 'Tubérculo' })
  tipo: string;

  @ApiProperty({ example: 'Invierno' })
  temporada: string;

  @ApiProperty({ example: 'Sierra' })
  region: string;
}
