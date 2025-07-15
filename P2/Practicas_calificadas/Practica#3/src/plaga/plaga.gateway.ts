import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PlagaService } from './plaga.service';
import { CreatePlagaDto } from './dto/create-plaga.dto';
import { UpdatePlagaDto } from './dto/update-plaga.dto';

@WebSocketGateway({ cors: true })
export class PlagaGateway {
  @WebSocketServer() wss: Server;
  constructor(private readonly plagaService: PlagaService) {}

  @SubscribeMessage('createPlaga')
  async create(@MessageBody() dto: CreatePlagaDto) {
    await this.plagaService.create(dto);
    this.wss.emit('plagaCreated', await this.plagaService.findAll());
  }

  @SubscribeMessage('listPlaga')
  async list() {
    this.wss.emit('plagaList', await this.plagaService.findAll());
  }

  @SubscribeMessage('updatePlaga')
  async update(@MessageBody() payload: { id: number; dto: UpdatePlagaDto }) {
    await this.plagaService.update(payload.id, payload.dto);
    this.wss.emit('plagaUpdated', await this.plagaService.findAll());
  }

  @SubscribeMessage('deletePlaga')
  async remove(@MessageBody() id: number) {
    await this.plagaService.remove(id);
    this.wss.emit('plagaDeleted', await this.plagaService.findAll());
  }
}