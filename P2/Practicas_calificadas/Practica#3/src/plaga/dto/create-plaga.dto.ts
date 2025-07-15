import { IsString } from 'class-validator';

export class CreatePlagaDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsString()
  regionAfectada: string;

  @IsString()
  nivelRiesgo: string;
}