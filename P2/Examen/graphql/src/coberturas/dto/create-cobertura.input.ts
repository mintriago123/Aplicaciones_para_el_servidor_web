import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateCoberturaInput {
    @Field()
    tipo: string;

    @Field()
    seguro: string;
    
    @Field(() => Float)
    deducible: number; // Deducible asociado a la cobertura
}
