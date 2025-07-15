import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';

@Injectable()
export class CultivoService {
  constructor(
    @InjectRepository(Cultivo)
    private repo: Repository<Cultivo>,
  ) {}

  async create(dto: CreateCultivoDto): Promise<Cultivo> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(): Promise<Cultivo[]> {
    return this.repo.find();
  }

  async update(id: number, dto: UpdateCultivoDto): Promise<Cultivo> {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException('Cultivo no encontrado');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}