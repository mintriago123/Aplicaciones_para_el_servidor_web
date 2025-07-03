import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DatoAExportarService } from './datoaexportar.service';
import { DatoAExportar } from './entities/datoaexportar.entity';
import { CreateDatoAExportarInput } from './dto/create-datoaexportar.input';
import { UpdateDatoAExportarInput } from './dto/update-datoaexportar.input';

@Resolver(() => DatoAExportar)
export class DatoAExportarResolver {
  constructor(private readonly service: DatoAExportarService) {}

  @Mutation(() => DatoAExportar)
  createDatoAExportar(@Args('createDatoAExportarInput') input: CreateDatoAExportarInput): Promise<DatoAExportar> {
    return this.service.create(input);
  }

  @Query(() => [DatoAExportar], { name: 'datoAExportars' })
  findAll(): Promise<DatoAExportar[]> {
    return this.service.findAll();
  }

  @Query(() => DatoAExportar, { name: 'datoAExportar' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<DatoAExportar> {
    return this.service.findOne(id);
  }

  @Mutation(() => DatoAExportar)
  updateDatoAExportar(@Args('updateDatoAExportarInput') input: UpdateDatoAExportarInput): Promise<DatoAExportar> {
    return this.service.update(input.id, input);
  }

  @Mutation(() => DatoAExportar)
  removeDatoAExportar(@Args('id', { type: () => Int }) id: number): Promise<DatoAExportar> {
    return this.service.remove(id);
  }
}
