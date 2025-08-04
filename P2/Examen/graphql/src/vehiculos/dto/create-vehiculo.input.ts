import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVehiculoInput {
  @Field()
  tipo: string;

  @Field()
  marca: string;

  @Field()
  modelo: string;

  @Field(() => Int)
  anioFabricacion: number;
}
