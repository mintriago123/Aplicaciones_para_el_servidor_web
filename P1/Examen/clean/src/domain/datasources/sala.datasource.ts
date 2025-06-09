import { CreateSalaDto, UpdateSalaDto } from '../dtos';
import { SalaEntity } from '../entities/sala.entity';

export abstract class SalaDatasource {

  abstract create(createSalaDto: CreateSalaDto): Promise<SalaEntity>;

  abstract getAll(): Promise<SalaEntity[]>;

  abstract findById(id: number): Promise<SalaEntity>;

  abstract updateById(updateSalaDto: UpdateSalaDto): Promise<SalaEntity>;

  abstract deleteById(id: number): Promise<SalaEntity>;

}
