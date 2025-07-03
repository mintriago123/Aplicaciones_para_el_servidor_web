import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateDatoAExportarInput } from './create-datoaexportar.input';

@InputType()
export class UpdateDatoAExportarInput extends PartialType(CreateDatoAExportarInput) {
  @Field(() => Int)
  id: number;
}
