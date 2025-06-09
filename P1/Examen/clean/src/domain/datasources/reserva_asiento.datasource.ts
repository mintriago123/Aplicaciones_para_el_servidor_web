import { CreateReservaAsientoDto, UpdateReservaAsientoDto } from '../dtos';
import { ReservaAsientoEntity } from '../entities/reserva_asiento.entity';

export abstract class ReservaAsientoDatasource {

  abstract create(createReservaAsientoDto: CreateReservaAsientoDto): Promise<ReservaAsientoEntity>;

  abstract getAll(): Promise<ReservaAsientoEntity[]>;

  abstract findById(id: number): Promise<ReservaAsientoEntity>;

  abstract updateById(updateReservaAsientoDto: UpdateReservaAsientoDto): Promise<ReservaAsientoEntity>;

  abstract deleteById(id: number): Promise<ReservaAsientoEntity>;

}
