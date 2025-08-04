import { CreateCoberturaInput } from './create-cobertura.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCoberturaInput extends PartialType(CreateCoberturaInput) {
  @Field(() => Int)
  id: number;
}
