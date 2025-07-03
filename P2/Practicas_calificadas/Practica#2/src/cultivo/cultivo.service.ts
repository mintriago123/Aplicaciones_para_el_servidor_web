import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoInput } from './dto/create-cultivo.input';
import { UpdateCultivoInput } from './dto/update-cultivo.input';

@Injectable()
export class CultivoService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  async create(createCultivoInput: CreateCultivoInput): Promise<Cultivo> {
    const cultivo = this.cultivoRepository.create(createCultivoInput);
    return this.cultivoRepository.save(cultivo);
  }

  async findAll(): Promise<Cultivo[]> {
    return this.cultivoRepository.find();
  }

  async findOne(id: number): Promise<Cultivo> {
    const cultivo = await this.cultivoRepository.findOneBy({ id });
    if (!cultivo) {
      throw new NotFoundException(`Cultivo con ID ${id} no encontrado`);
    }
    return cultivo;
  }

  async update(id: number, updateCultivoInput: UpdateCultivoInput): Promise<Cultivo> {
    const cultivo = await this.cultivoRepository.preload({
      id,
      ...updateCultivoInput,
    });
    if (!cultivo) {
      throw new NotFoundException(`Cultivo con ID ${id} no encontrado`);
    }
    return this.cultivoRepository.save(cultivo);
  }

  async remove(id: number): Promise<Cultivo> {
    const cultivo = await this.findOne(id);
    return this.cultivoRepository.remove(cultivo);
  }
}
