import { CreateConductorInput } from './create-conductor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateConductorInput extends PartialType(CreateConductorInput) {
  @Field(() => Int)
  id: number;
}
