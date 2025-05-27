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
    private plagaRepository: Repository<Plaga>,
  ) {}

  create(dto: CreatePlagaDto) {
    const plaga = this.plagaRepository.create(dto);
    return this.plagaRepository.save(plaga);
  }

  findAll() {
    return this.plagaRepository.find();
  }

  async findOne(id: number) {
    const plaga = await this.plagaRepository.findOneBy({ id });
    if (!plaga) throw new NotFoundException(`Plaga #${id} no encontrada`);
    return plaga;
  }

  async update(id: number, dto: UpdatePlagaDto) {
    const plaga = await this.plagaRepository.preload({ id, ...dto });
    if (!plaga) throw new NotFoundException(`Plaga #${id} no encontrada`);
    return this.plagaRepository.save(plaga);
  }

  async remove(id: number) {
    const plaga = await this.findOne(id);
    return this.plagaRepository.remove(plaga);
  }
}
