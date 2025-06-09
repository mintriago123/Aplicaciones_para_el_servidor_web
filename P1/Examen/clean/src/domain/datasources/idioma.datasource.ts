import { CreateIdiomaDto, UpdateIdiomaDto } from '../dtos';
import { IdiomaEntity } from '../entities/idioma.entity';

export abstract class IdiomaDatasource {

  abstract create(createIdiomaDto: CreateIdiomaDto): Promise<IdiomaEntity>;

  abstract getAll(): Promise<IdiomaEntity[]>;

  abstract findById(id: number): Promise<IdiomaEntity>;

  abstract updateById(updateIdiomaDto: UpdateIdiomaDto): Promise<IdiomaEntity>;

  abstract deleteById(id: number): Promise<IdiomaEntity>;

}
