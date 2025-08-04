import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoberturasService } from './coberturas.service';
import { Cobertura } from './entities/cobertura.entity';
import { CreateCoberturaInput } from './dto/create-cobertura.input';
import { UpdateCoberturaInput } from './dto/update-cobertura.input';

@Resolver(() => Cobertura)
export class CoberturasResolver {
  constructor(private readonly coberturasService: CoberturasService) {}

  @Mutation(() => Cobertura)
  createCobertura(@Args('createCoberturaInput') createCoberturaInput: CreateCoberturaInput) {
    return this.coberturasService.create(createCoberturaInput);
  }

  @Query(() => [Cobertura], { name: 'coberturas' })
  findAll() {
    return this.coberturasService.findAll();
  }

  @Query(() => Cobertura, { name: 'cobertura' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coberturasService.findOne(id);
  }

  @Mutation(() => Cobertura)
  updateCobertura(@Args('updateCoberturaInput') updateCoberturaInput: UpdateCoberturaInput) {
    return this.coberturasService.update(updateCoberturaInput.id, updateCoberturaInput);
  }

  @Mutation(() => Cobertura)
  removeCobertura(@Args('id', { type: () => Int }) id: number) {
    return this.coberturasService.remove(id);
  }
}
