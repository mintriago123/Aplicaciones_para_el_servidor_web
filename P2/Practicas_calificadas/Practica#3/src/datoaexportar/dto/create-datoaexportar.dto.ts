import { IsString, IsInt } from 'class-validator';

export class CreateDatoAexportarDto {
  @IsString()
  producto: string;

  @IsInt()
  cantidad: number;

  @IsString()
  destino: string;

  @IsString()
  fechaExportacion: string;
}