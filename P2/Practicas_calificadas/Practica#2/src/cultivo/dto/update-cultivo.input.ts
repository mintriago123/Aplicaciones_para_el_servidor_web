import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCultivoInput } from './create-cultivo.input';

@InputType()
export class UpdateCultivoInput extends PartialType(CreateCultivoInput) {
  @Field(() => Int)
  id: number;
}
