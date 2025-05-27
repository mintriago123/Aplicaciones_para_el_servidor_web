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
    private cultivoRepository: Repository<Cultivo>,
  ) {}

  create(dto: CreateCultivoDto) {
    const cultivo = this.cultivoRepository.create(dto);
    return this.cultivoRepository.save(cultivo);
  }

  findAll() {
    return this.cultivoRepository.find();
  }

  async findOne(id: number) {
    const cultivo = await this.cultivoRepository.findOneBy({ id });
    if (!cultivo) throw new NotFoundException(`Cultivo #${id} no encontrado`);
    return cultivo;
  }

  async update(id: number, dto: UpdateCultivoDto) {
    const cultivo = await this.cultivoRepository.preload({ id, ...dto });
    if (!cultivo) throw new NotFoundException(`Cultivo #${id} no encontrado`);
    return this.cultivoRepository.save(cultivo);
  }

  async remove(id: number) {
    const cultivo = await this.findOne(id);
    return this.cultivoRepository.remove(cultivo);
  }
}
