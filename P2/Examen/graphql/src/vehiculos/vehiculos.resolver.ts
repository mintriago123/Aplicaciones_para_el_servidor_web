import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehiculosService } from './vehiculos.service';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoInput } from './dto/create-vehiculo.input';
import { UpdateVehiculoInput } from './dto/update-vehiculo.input';

@Resolver(() => Vehiculo)
export class VehiculosResolver {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Mutation(() => Vehiculo)
  createVehiculo(@Args('createVehiculoInput') createVehiculoInput: CreateVehiculoInput) {
    return this.vehiculosService.create(createVehiculoInput);
  }

  @Query(() => [Vehiculo], { name: 'vehiculos' })
  findAll() {
    return this.vehiculosService.findAll();
  }

  @Query(() => Vehiculo, { name: 'vehiculo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vehiculosService.findOne(id);
  }

  @Mutation(() => Vehiculo)
  updateVehiculo(@Args('updateVehiculoInput') updateVehiculoInput: UpdateVehiculoInput) {
    return this.vehiculosService.update(updateVehiculoInput.id, updateVehiculoInput);
  }

  @Mutation(() => Vehiculo)
  removeVehiculo(@Args('id', { type: () => Int }) id: number) {
    return this.vehiculosService.remove(id);
  }
}
