import { Conductor } from '../entities/conductor.entity';
import { CreateConductorDto, UpdateConductorDto } from '../dto/conductor.dto';

export interface IConductorRepository {
  create(createConductorDto: CreateConductorDto): Conductor;
  findAll(): Conductor[];
  findOne(id: number): Conductor;
  findByEmail(email: string): Conductor;
  update(id: number, updateConductorDto: UpdateConductorDto): Conductor;
  remove(id: number): void;
  emailExists(email: string): boolean;
}
