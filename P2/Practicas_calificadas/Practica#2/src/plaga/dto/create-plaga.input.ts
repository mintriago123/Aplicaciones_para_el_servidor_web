import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePlagaInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  regionAfectada: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nivelRiesgo: string;
}
