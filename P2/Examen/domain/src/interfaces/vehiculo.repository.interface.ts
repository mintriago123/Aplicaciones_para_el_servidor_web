import { Vehiculo } from '../entities/vehiculo.entity';
import { CreateVehiculoDto, UpdateVehiculoDto } from '../dto/vehiculo.dto';

export interface IVehiculoRepository {
  create(createVehiculoDto: CreateVehiculoDto): Vehiculo;
  findAll(): Vehiculo[];
  findOne(id: number): Vehiculo;
  findByTipo(tipo: string): Vehiculo[];
  findByMarca(marca: string): Vehiculo[];
  findByAnoRango(anoMinimo: number, anoMaximo: number): Vehiculo[];
  update(id: number, updateVehiculoDto: UpdateVehiculoDto): Vehiculo;
  remove(id: number): void;
  exists(marca: string, modelo: string, ano: number): boolean;
}
