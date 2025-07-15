import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plaga } from './entities/plaga.entity';
import { CreatePlagaDto } from './dto/create-plaga.dto';
import { UpdatePlagaDto } from './dto/update-plaga.dto';

@Injectable()
export class PlagaService {
  constructor(
    @InjectRepository(Plaga)
    private repo: Repository<Plaga>,
  ) {}

  async create(dto: CreatePlagaDto): Promise<Plaga> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(): Promise<Plaga[]> {
    return this.repo.find();
  }

  async update(id: number, dto: UpdatePlagaDto): Promise<Plaga> {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException('Plaga no encontrada');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}