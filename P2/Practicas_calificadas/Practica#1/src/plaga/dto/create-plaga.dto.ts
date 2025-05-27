import { ApiProperty } from '@nestjs/swagger';

export class CreatePlagaDto {
  @ApiProperty({ example: 'Mosca Blanca' })
  nombre: string;

  @ApiProperty({ example: 'Insecto' })
  tipo: string;

  @ApiProperty({ example: 'Costa' })
  regionAfectada: string;

  @ApiProperty({ example: 'Alto' })
  nivelRiesgo: string;
}
