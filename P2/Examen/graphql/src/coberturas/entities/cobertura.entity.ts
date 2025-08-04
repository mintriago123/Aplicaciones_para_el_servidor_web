import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Cobertura {
  @Field(() => Int, { description: 'ID único de la cobertura' })
  id: number;

  @Field({ description: 'Tipo de cobertura (total, parcial, contra robo, etc.)' })
  tipo: string;

  @Field({ description: 'Tipo de seguro asociado a la cobertura' })
  seguro: string;

  @Field(() => Float, { description: 'Deducible asociado a la cobertura' })
  deducible: number;
}
