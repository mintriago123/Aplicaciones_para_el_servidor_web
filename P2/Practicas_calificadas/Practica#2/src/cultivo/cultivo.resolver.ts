import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CultivoService } from './cultivo.service';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoInput } from './dto/create-cultivo.input';
import { UpdateCultivoInput } from './dto/update-cultivo.input';

@Resolver(() => Cultivo)
export class CultivoResolver {
  constructor(private readonly cultivoService: CultivoService) {}

  @Mutation(() => Cultivo)
  createCultivo(@Args('createCultivoInput') createCultivoInput: CreateCultivoInput): Promise<Cultivo> {
    return this.cultivoService.create(createCultivoInput);
  }

  @Query(() => [Cultivo], { name: 'cultivos' })
  findAll(): Promise<Cultivo[]> {
    return this.cultivoService.findAll();
  }

  @Query(() => Cultivo, { name: 'cultivo' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cultivo> {
    return this.cultivoService.findOne(id);
  }

  @Mutation(() => Cultivo)
  updateCultivo(@Args('updateCultivoInput') updateCultivoInput: UpdateCultivoInput): Promise<Cultivo> {
    return this.cultivoService.update(updateCultivoInput.id, updateCultivoInput);
  }

  @Mutation(() => Cultivo)
  removeCultivo(@Args('id', { type: () => Int }) id: number): Promise<Cultivo> {
    return this.cultivoService.remove(id);
  }
}
