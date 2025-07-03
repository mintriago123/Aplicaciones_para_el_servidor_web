import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plaga } from './entities/plaga.entity';
import { CreatePlagaInput } from './dto/create-plaga.input';
import { UpdatePlagaInput } from './dto/update-plaga.input';

@Injectable()
export class PlagaService {
  constructor(
    @InjectRepository(Plaga)
    private readonly plagaRepository: Repository<Plaga>,
  ) {}

  async create(createPlagaInput: CreatePlagaInput): Promise<Plaga> {
    const plaga = this.plagaRepository.create(createPlagaInput);
    return this.plagaRepository.save(plaga);
  }

  async findAll(): Promise<Plaga[]> {
    return this.plagaRepository.find();
  }

  async findOne(id: number): Promise<Plaga> {
    const plaga = await this.plagaRepository.findOneBy({ id });
    if (!plaga) {
      throw new NotFoundException(`Plaga con ID ${id} no encontrada`);
    }
    return plaga;
  }

  async update(id: number, updatePlagaInput: UpdatePlagaInput): Promise<Plaga> {
    const plaga = await this.plagaRepository.preload({
      id,
      ...updatePlagaInput,
    });
    if (!plaga) {
      throw new NotFoundException(`Plaga con ID ${id} no encontrada`);
    }
    return this.plagaRepository.save(plaga);
  }

  async remove(id: number): Promise<Plaga> {
    const plaga = await this.findOne(id);
    return this.plagaRepository.remove(plaga);
  }
}
