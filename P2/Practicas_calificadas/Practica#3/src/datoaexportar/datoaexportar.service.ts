import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatoAexportar } from './entities/datoaexportar.entity';
import { CreateDatoAexportarDto } from './dto/create-datoaexportar.dto';
import { UpdateDatoAexportarDto } from './dto/update-datoaexportar.dto';

@Injectable()
export class DatoAexportarService {
  constructor(
    @InjectRepository(DatoAexportar)
    private repo: Repository<DatoAexportar>,
  ) {}

  async create(dto: CreateDatoAexportarDto): Promise<DatoAexportar> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(): Promise<DatoAexportar[]> {
    return this.repo.find();
  }

  async update(id: number, dto: UpdateDatoAexportarDto): Promise<DatoAexportar> {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException('DatoAexportar no encontrado');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}