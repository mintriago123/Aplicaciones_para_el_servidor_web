import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ConductorService } from './conductor.service';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateConductorDto } from './dto/update-conductor.dto';

@WebSocketGateway()
export class ConductorGateway {
  constructor(private readonly conductorService: ConductorService) {}

  @SubscribeMessage('createConductor')
  create(@MessageBody() createConductorDto: CreateConductorDto) {
    return this.conductorService.create(createConductorDto);
  }

  @SubscribeMessage('findAllConductor')
  findAll() {
    return this.conductorService.findAll();
  }

  @SubscribeMessage('findOneConductor')
  findOne(@MessageBody() id: number) {
    return this.conductorService.findOne(id);
  }

  @SubscribeMessage('updateConductor')
  update(@MessageBody() updateConductorDto: UpdateConductorDto) {
    return this.conductorService.update(updateConductorDto.id, updateConductorDto);
  }

  @SubscribeMessage('removeConductor')
  remove(@MessageBody() id: number) {
    return this.conductorService.remove(id);
  }
}
