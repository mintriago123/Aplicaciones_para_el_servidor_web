import { Injectable } from '@nestjs/common';
import { Cobertura } from '../entities/cobertura.entity';
import { CreateCoberturaDto, UpdateCoberturaDto } from '../dto/cobertura.dto';
import type { ICoberturaRepository } from '../interfaces/cobertura.repository.interface';

@Injectable()
export class InMemoryCoberturaRepository implements ICoberturaRepository {
  private coberturas: Cobertura[] = [
    new Cobertura({ id: 1, tipo: 'total', seguro: 'todo riesgo', deducible: 500.00 }),
    new Cobertura({ id: 2, tipo: 'parcial', seguro: 'responsabilidad civil', deducible: 250.00 }),
    new Cobertura({ id: 3, tipo: 'contra robo', seguro: 'robo y hurto', deducible: 300.00 }),
    new Cobertura({ id: 4, tipo: 'contra terceros', seguro: 'daños a terceros', deducible: 200.00 }),
  ];
  private nextId = 5;

  create(createCoberturaDto: CreateCoberturaDto): Cobertura {
    const nuevaCobertura = new Cobertura({
      id: this.nextId++,
      tipo: createCoberturaDto.tipo.toLowerCase(),
      seguro: createCoberturaDto.seguro.toLowerCase(),
      deducible: parseFloat(createCoberturaDto.deducible.toFixed(2)),
    });

    this.coberturas.push(nuevaCobertura);
    return nuevaCobertura;
  }

  findAll(): Cobertura[] {
    return [...this.coberturas];
  }

  findOne(id: number): Cobertura {
    const cobertura = this.coberturas.find(c => c.id === id);
    if (!cobertura) {
      throw new Error(`Cobertura with id ${id} not found`);
    }
    return cobertura;
  }

  findByTipo(tipo: string): Cobertura[] {
    return this.coberturas.filter(c => c.tipo.toLowerCase() === tipo.toLowerCase());
  }

  findBySeguro(seguro: string): Cobertura[] {
    return this.coberturas.filter(c => c.seguro.toLowerCase().includes(seguro.toLowerCase()));
  }

  update(id: number, updateCoberturaDto: UpdateCoberturaDto): Cobertura {
    const index = this.coberturas.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Cobertura with id ${id} not found`);
    }

    const coberturaActualizada = {
      ...this.coberturas[index],
      ...(updateCoberturaDto.tipo && { tipo: updateCoberturaDto.tipo.toLowerCase() }),
      ...(updateCoberturaDto.seguro && { seguro: updateCoberturaDto.seguro.toLowerCase() }),
      ...(updateCoberturaDto.deducible !== undefined && { deducible: parseFloat(updateCoberturaDto.deducible.toFixed(2)) }),
    };

    this.coberturas[index] = coberturaActualizada;
    return coberturaActualizada;
  }

  remove(id: number): void {
    const index = this.coberturas.findIndex(c => c.id === id);
    if (index !== -1) {
      this.coberturas.splice(index, 1);
    }
  }
}
