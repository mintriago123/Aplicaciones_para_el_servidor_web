import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCultivoInput {
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
  temporada: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  region: string;
}
