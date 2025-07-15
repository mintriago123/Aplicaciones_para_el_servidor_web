import { IsString } from 'class-validator';

export class CreateCultivoDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsString()
  temporada: string;

  @IsString()
  region: string;
}