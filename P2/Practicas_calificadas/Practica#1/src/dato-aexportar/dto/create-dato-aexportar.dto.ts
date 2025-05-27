import { ApiProperty } from '@nestjs/swagger';

export class CreateDatoAexportarDto {
  @ApiProperty({ example: 'Banano' })
  producto: string;

  @ApiProperty({ example: 500 })
  cantidad: number;

  @ApiProperty({ example: 'Países Bajos' })
  destino: string;

  @ApiProperty({ example: '2025-07-01' })
  fechaExportacion: string;
}
