import { CreatePeliculaDto, UpdatePeliculaDto } from '../dtos';
import { PeliculaEntity } from '../entities/pelicula.entity';

export abstract class PeliculaRepository {

  abstract create(createPeliculaDto: CreatePeliculaDto): Promise<PeliculaEntity>;

  abstract getAll(): Promise<PeliculaEntity[]>;

  abstract findById(id: number): Promise<PeliculaEntity>;

  abstract updateById(updatePeliculaDto: UpdatePeliculaDto): Promise<PeliculaEntity>;

  abstract deleteById(id: number): Promise<PeliculaEntity>;

}
