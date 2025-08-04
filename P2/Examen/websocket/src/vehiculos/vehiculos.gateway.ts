import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@WebSocketGateway()
export class VehiculosGateway {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @SubscribeMessage('createVehiculo')
  create(@MessageBody() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @SubscribeMessage('findAllVehiculos')
  findAll() {
    return this.vehiculosService.findAll();
  }

  @SubscribeMessage('findOneVehiculo')
  findOne(@MessageBody() id: number) {
    return this.vehiculosService.findOne(id);
  }

  @SubscribeMessage('updateVehiculo')
  update(@MessageBody() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(updateVehiculoDto.id, updateVehiculoDto);
  }

  @SubscribeMessage('removeVehiculo')
  remove(@MessageBody() id: number) {
    return this.vehiculosService.remove(id);
  }
}
