import { Cobertura } from '../entities/cobertura.entity';
import { CreateCoberturaDto, UpdateCoberturaDto } from '../dto/cobertura.dto';

export interface ICoberturaRepository {
  create(createCoberturaDto: CreateCoberturaDto): Cobertura;
  findAll(): Cobertura[];
  findOne(id: number): Cobertura;
  findByTipo(tipo: string): Cobertura[];
  findBySeguro(seguro: string): Cobertura[];
  update(id: number, updateCoberturaDto: UpdateCoberturaDto): Cobertura;
  remove(id: number): void;
}
