import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreatePlagaInput } from './create-plaga.input';

@InputType()
export class UpdatePlagaInput extends PartialType(CreatePlagaInput) {
  @Field(() => Int)
  id: number;
}
