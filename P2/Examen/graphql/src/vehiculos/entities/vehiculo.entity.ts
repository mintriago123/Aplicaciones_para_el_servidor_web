import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Vehiculo {
  @Field(() => Int, { description: 'ID único del vehículo' })
  id: number;

  @Field({ description: 'Tipo de vehículo (sedan, camioneta, SUV, etc.)' })
  tipo: string;

  @Field({ description: 'Marca del vehículo' })
  marca: string;

  @Field({ description: 'Modelo del vehículo' })
  modelo: string;

  @Field(() => Int, { description: 'Año de fabricación del vehículo' })
  anioFabricacion: number;
}
