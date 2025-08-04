import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
  export class CreateConductorInput {

    @Field({ description: 'Nombre del conductor' })
    nombre: string;

    @Field({ description: 'Apellido del conductor' })
    apellido: string;

    @Field({ description: 'Email del conductor' })
    email: string;
}
