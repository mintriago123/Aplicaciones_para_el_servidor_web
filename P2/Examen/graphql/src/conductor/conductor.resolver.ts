import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConductorService } from './conductor.service';
import { Conductor } from './entities/conductor.entity';
import { CreateConductorInput } from './dto/create-conductor.input';
import { UpdateConductorInput } from './dto/update-conductor.input';

@Resolver(() => Conductor)
export class ConductorResolver {
  constructor(private readonly conductorService: ConductorService) {}

  @Mutation(() => Conductor)
  createConductor(@Args('createConductorInput') createConductorInput: CreateConductorInput) {
    return this.conductorService.create(createConductorInput);
  }

  @Query(() => [Conductor], { name: 'conductores' })
  findAll() {
    return this.conductorService.findAll();
  }

  @Query(() => Conductor, { name: 'conductor' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.conductorService.findOne(id);
  }

  @Mutation(() => Conductor)
  updateConductor(@Args('updateConductorInput') updateConductorInput: UpdateConductorInput) {
    return this.conductorService.update(updateConductorInput.id, updateConductorInput);
  }

  @Mutation(() => Conductor)
  removeConductor(@Args('id', { type: () => Int }) id: number) {
    return this.conductorService.remove(id);
  }
}
