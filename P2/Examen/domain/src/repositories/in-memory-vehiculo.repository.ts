import { Injectable } from '@nestjs/common';
import { Vehiculo } from '../entities/vehiculo.entity';
import { CreateVehiculoDto, UpdateVehiculoDto } from '../dto/vehiculo.dto';
import type { IVehiculoRepository } from '../interfaces/vehiculo.repository.interface';

@Injectable()
export class InMemoryVehiculoRepository implements IVehiculoRepository {
  private vehiculos: Vehiculo[] = [
    new Vehiculo({ id: 1, tipo: 'sedan', marca: 'Toyota', modelo: 'Corolla', anoFabricacion: 2020 }),
    new Vehiculo({ id: 2, tipo: 'camioneta', marca: 'Ford', modelo: 'F-150', anoFabricacion: 2019 }),
    new Vehiculo({ id: 3, tipo: 'SUV', marca: 'Honda', modelo: 'CR-V', anoFabricacion: 2021 }),
    new Vehiculo({ id: 4, tipo: 'hatchback', marca: 'Volkswagen', modelo: 'Golf', anoFabricacion: 2018 }),
  ];
  private nextId = 5;

  create(createVehiculoDto: CreateVehiculoDto): Vehiculo {
    const nuevoVehiculo = new Vehiculo({
      id: this.nextId++,
      tipo: createVehiculoDto.tipo.toLowerCase(),
      marca: createVehiculoDto.marca.trim(),
      modelo: createVehiculoDto.modelo.trim(),
      anoFabricacion: createVehiculoDto.año,
    });

    this.vehiculos.push(nuevoVehiculo);
    return nuevoVehiculo;
  }

  findAll(): Vehiculo[] {
    return [...this.vehiculos];
  }

  findOne(id: number): Vehiculo {
    const vehiculo = this.vehiculos.find(v => v.id === id);
    if (!vehiculo) {
      throw new Error(`Vehiculo with id ${id} not found`);
    }
    return vehiculo;
  }

  findByTipo(tipo: string): Vehiculo[] {
    return this.vehiculos.filter(v => v.tipo.toLowerCase() === tipo.toLowerCase());
  }

  findByMarca(marca: string): Vehiculo[] {
    return this.vehiculos.filter(v => v.marca.toLowerCase().includes(marca.toLowerCase()));
  }

  findByAnoRango(anoMinimo: number, anoMaximo: number): Vehiculo[] {
    return this.vehiculos.filter(v => 
      v.anoFabricacion >= anoMinimo && v.anoFabricacion <= anoMaximo
    );
  }

  update(id: number, updateVehiculoDto: UpdateVehiculoDto): Vehiculo {
    const index = this.vehiculos.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Vehiculo with id ${id} not found`);
    }

    const vehiculoActualizado = {
      ...this.vehiculos[index],
      ...(updateVehiculoDto.tipo && { tipo: updateVehiculoDto.tipo.toLowerCase() }),
      ...(updateVehiculoDto.marca && { marca: updateVehiculoDto.marca.trim() }),
      ...(updateVehiculoDto.modelo && { modelo: updateVehiculoDto.modelo.trim() }),
      ...(updateVehiculoDto.año && { anoFabricacion: updateVehiculoDto.año }),
    };

    this.vehiculos[index] = vehiculoActualizado;
    return vehiculoActualizado;
  }

  remove(id: number): void {
    const index = this.vehiculos.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehiculos.splice(index, 1);
    }
  }

  exists(marca: string, modelo: string, ano: number): boolean {
    return this.vehiculos.some(v => 
      v.marca.toLowerCase() === marca.toLowerCase() &&
      v.modelo.toLowerCase() === modelo.toLowerCase() &&
      v.anoFabricacion === ano
    );
  }
}
