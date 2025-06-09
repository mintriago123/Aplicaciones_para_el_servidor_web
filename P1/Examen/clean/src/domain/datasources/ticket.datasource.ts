import { CreateTicketDto, UpdateTicketDto } from '../dtos';
import { TicketEntity } from '../entities/ticket.entity';

export abstract class TicketDatasource {

  abstract create(createTicketDto: CreateTicketDto): Promise<TicketEntity>;

  abstract getAll(): Promise<TicketEntity[]>;

  abstract findById(id: number): Promise<TicketEntity>;

  abstract updateById(updateTicketDto: UpdateTicketDto): Promise<TicketEntity>;

  abstract deleteById(id: number): Promise<TicketEntity>;

}
