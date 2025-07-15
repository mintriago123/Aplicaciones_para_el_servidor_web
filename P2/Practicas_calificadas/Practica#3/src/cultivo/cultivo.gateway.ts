import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CultivoService } from './cultivo.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';

@WebSocketGateway({ cors: true })
export class CultivoGateway {
  @WebSocketServer() wss: Server;
  constructor(private readonly cultivoService: CultivoService) {}

  @SubscribeMessage('createCultivo')
  async create(@MessageBody() dto: CreateCultivoDto) {
    await this.cultivoService.create(dto);
    this.wss.emit('cultivoCreated', await this.cultivoService.findAll());
  }

  @SubscribeMessage('listCultivo')
  async list() {
    this.wss.emit('cultivoList', await this.cultivoService.findAll());
  }

  @SubscribeMessage('updateCultivo')
  async update(@MessageBody() payload: { id: number; dto: UpdateCultivoDto }) {
    await this.cultivoService.update(payload.id, payload.dto);
    this.wss.emit('cultivoUpdated', await this.cultivoService.findAll());
  }

  @SubscribeMessage('deleteCultivo')
  async remove(@MessageBody() id: number) {
    await this.cultivoService.remove(id);
    this.wss.emit('cultivoDeleted', await this.cultivoService.findAll());
  }
}