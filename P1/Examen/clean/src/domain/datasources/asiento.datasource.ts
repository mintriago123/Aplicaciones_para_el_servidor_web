import { CreateAsientoDto, UpdateAsientoDto } from '../dtos';
import { AsientoEntity } from '../entities/asiento.entity';

export abstract class AsientoDatasource {

  abstract create(createAsientoDto: CreateAsientoDto): Promise<AsientoEntity>;

  abstract getAll(): Promise<AsientoEntity[]>;

  abstract findById(id: number): Promise<AsientoEntity>;

  abstract updateById(updateAsientoDto: UpdateAsientoDto): Promise<AsientoEntity>;

  abstract deleteById(id: number): Promise<AsientoEntity>;

}
