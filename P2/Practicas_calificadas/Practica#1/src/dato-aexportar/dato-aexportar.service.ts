import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatoAexportar } from './entities/dato-aexportar.entity';
import { CreateDatoAexportarDto } from './dto/create-dato-aexportar.dto';
import { UpdateDatoAexportarDto } from './dto/update-dato-aexportar.dto';

@Injectable()
export class DatoAexportarService {
  constructor(
    @InjectRepository(DatoAexportar)
    private repo: Repository<DatoAexportar>,
  ) {}

  create(dto: CreateDatoAexportarDto) {
    const dato = this.repo.create(dto);
    return this.repo.save(dato);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const dato = await this.repo.findOneBy({ id });
    if (!dato) throw new NotFoundException(`Dato #${id} no encontrado`);
    return dato;
  }

  async update(id: number, dto: UpdateDatoAexportarDto) {
    const dato = await this.repo.preload({ id, ...dto });
    if (!dato) throw new NotFoundException(`Dato #${id} no encontrado`);
    return this.repo.save(dato);
  }

  async remove(id: number) {
    const dato = await this.findOne(id);
    return this.repo.remove(dato);
  }
}
