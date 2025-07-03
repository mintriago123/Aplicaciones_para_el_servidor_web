import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

@InputType()
export class CreateDatoAExportarInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  producto: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  destino: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fechaExportacion: string;
}
