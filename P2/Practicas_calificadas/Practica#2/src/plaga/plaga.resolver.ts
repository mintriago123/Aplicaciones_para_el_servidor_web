import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlagaService } from './plaga.service';
import { Plaga } from './entities/plaga.entity';
import { CreatePlagaInput } from './dto/create-plaga.input';
import { UpdatePlagaInput } from './dto/update-plaga.input';

@Resolver(() => Plaga)
export class PlagaResolver {
  constructor(private readonly plagaService: PlagaService) {}

  @Mutation(() => Plaga)
  createPlaga(@Args('createPlagaInput') createPlagaInput: CreatePlagaInput): Promise<Plaga> {
    return this.plagaService.create(createPlagaInput);
  }

  @Query(() => [Plaga], { name: 'plagas' })
  findAll(): Promise<Plaga[]> {
    return this.plagaService.findAll();
  }

  @Query(() => Plaga, { name: 'plaga' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Plaga> {
    return this.plagaService.findOne(id);
  }

  @Mutation(() => Plaga)
  updatePlaga(@Args('updatePlagaInput') updatePlagaInput: UpdatePlagaInput): Promise<Plaga> {
    return this.plagaService.update(updatePlagaInput.id, updatePlagaInput);
  }

  @Mutation(() => Plaga)
  removePlaga(@Args('id', { type: () => Int }) id: number): Promise<Plaga> {
    return this.plagaService.remove(id);
  }
}
