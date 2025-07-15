import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DatoAexportarService } from './datoaexportar.service';
import { CreateDatoAexportarDto } from './dto/create-datoaexportar.dto';
import { UpdateDatoAexportarDto } from './dto/update-datoaexportar.dto';

@WebSocketGateway({ cors: true })
export class DatoAexportarGateway {
  @WebSocketServer() wss: Server;
  constructor(private service: DatoAexportarService) {}

  @SubscribeMessage('createDatoAexportar')
  async create(@MessageBody() dto: CreateDatoAexportarDto) {
    await this.service.create(dto);
    this.wss.emit('datoAexportarCreated', await this.service.findAll());
  }

  @SubscribeMessage('listDatoAexportar')
  async list() {
    this.wss.emit('datoAexportarList', await this.service.findAll());
  }

  @SubscribeMessage('updateDatoAexportar')
  async update(@MessageBody() payload: { id: number, dto: UpdateDatoAexportarDto }) {
    await this.service.update(payload.id, payload.dto);
    this.wss.emit('datoAexportarUpdated', await this.service.findAll());
  }

  @SubscribeMessage('deleteDatoAexportar')
  async remove(@MessageBody() id: number) {
    await this.service.remove(id);
    this.wss.emit('datoAexportarDeleted', await this.service.findAll());
  }
}