import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Conductor {
  @Field(() => Int, { description: 'ID único del conductor' })
  id: number;

  @Field({ description: 'Nombre del conductor' })
  nombre: string;

  @Field({ description: 'Apellido del conductor' })
  apellido: string;

  @Field({ description: 'Email del conductor' })
  email: string;
}
