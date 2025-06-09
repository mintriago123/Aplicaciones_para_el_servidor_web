import { CreateFuncionDto, UpdateFuncionDto } from '../dtos';
import { FuncionEntity } from '../entities/funcion.entity';

export abstract class FuncionDatasource {

  abstract create(createFuncionDto: CreateFuncionDto): Promise<FuncionEntity>;

  abstract getAll(): Promise<FuncionEntity[]>;

  abstract findById(id: number): Promise<FuncionEntity>;

  abstract updateById(updateFuncionDto: UpdateFuncionDto): Promise<FuncionEntity>;

  abstract deleteById(id: number): Promise<FuncionEntity>;

}
