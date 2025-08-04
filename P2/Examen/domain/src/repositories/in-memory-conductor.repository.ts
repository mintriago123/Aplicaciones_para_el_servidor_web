import { Injectable } from '@nestjs/common';
import { Conductor } from '../entities/conductor.entity';
import { CreateConductorDto, UpdateConductorDto } from '../dto/conductor.dto';
import type { IConductorRepository } from '../interfaces/conductor.repository.interface';

@Injectable()
export class InMemoryConductorRepository implements IConductorRepository {
  private conductores: Conductor[] = [
    new Conductor({ id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com' }),
    new Conductor({ id: 2, nombre: 'María', apellido: 'González', email: 'maria.gonzalez@email.com' }),
    new Conductor({ id: 3, nombre: 'Carlos', apellido: 'Rodríguez', email: 'carlos.rodriguez@email.com' }),
    new Conductor({ id: 4, nombre: 'Ana', apellido: 'López', email: 'ana.lopez@email.com' }),
  ];
  private nextId = 5;

  create(createConductorDto: CreateConductorDto): Conductor {
    const nuevoConductor = new Conductor({
      id: this.nextId++,
      nombre: createConductorDto.nombre.trim(),
      apellido: createConductorDto.apellido.trim(),
      email: createConductorDto.email.toLowerCase().trim(),
    });

    this.conductores.push(nuevoConductor);
    return nuevoConductor;
  }

  findAll(): Conductor[] {
    return [...this.conductores];
  }

  findOne(id: number): Conductor {
    const conductor = this.conductores.find(c => c.id === id);
    if (!conductor) {
      throw new Error(`Conductor with id ${id} not found`);
    }
    return conductor;
  }

  findByEmail(email: string): Conductor {
    const conductor = this.conductores.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!conductor) {
      throw new Error(`Conductor with email ${email} not found`);
    }
    return conductor;
  }

  update(id: number, updateConductorDto: UpdateConductorDto): Conductor {
    const index = this.conductores.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Conductor with id ${id} not found`);
    }

    const conductorActualizado = {
      ...this.conductores[index],
      ...(updateConductorDto.nombre && { nombre: updateConductorDto.nombre.trim() }),
      ...(updateConductorDto.apellido && { apellido: updateConductorDto.apellido.trim() }),
      ...(updateConductorDto.email && { email: updateConductorDto.email.toLowerCase().trim() }),
    };

    this.conductores[index] = conductorActualizado;
    return conductorActualizado;
  }

  remove(id: number): void {
    const index = this.conductores.findIndex(c => c.id === id);
    if (index !== -1) {
      this.conductores.splice(index, 1);
    }
  }

  emailExists(email: string): boolean {
    return this.conductores.some(c => c.email.toLowerCase() === email.toLowerCase());
  }
}
