import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatoAExportar } from './entities/datoaexportar.entity';
import { CreateDatoAExportarInput } from './dto/create-datoaexportar.input';
import { UpdateDatoAExportarInput } from './dto/update-datoaexportar.input';

@Injectable()
export class DatoAExportarService {
  constructor(
    @InjectRepository(DatoAExportar)
    private readonly repository: Repository<DatoAExportar>,
  ) {}

  async create(input: CreateDatoAExportarInput): Promise<DatoAExportar> {
    const entity = this.repository.create(input);
    return this.repository.save(entity);
  }

  async findAll(): Promise<DatoAExportar[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<DatoAExportar> {
    const dato = await this.repository.findOneBy({ id });
    if (!dato) {
      throw new NotFoundException(`DatoAExportar con ID ${id} no encontrado`);
    }
    return dato;
  }

  async update(id: number, input: UpdateDatoAExportarInput): Promise<DatoAExportar> {
    const entity = await this.repository.preload({ id, ...input });
    if (!entity) {
      throw new NotFoundException(`DatoAExportar con ID ${id} no encontrado`);
    }
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<DatoAExportar> {
    const entity = await this.findOne(id);
    return this.repository.remove(entity);
  }
}
