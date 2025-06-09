import { PeliculaRepository } from '../../domain/repositories/pelicula.repository';
import { PeliculaDatasource } from '../../domain/datasources/pelicula.datasource';
import { CreatePeliculaDto, UpdatePeliculaDto } from '../../domain/dtos';
import { PeliculaEntity } from '../../domain/entities/pelicula.entity';

export class PeliculaRepositoryImpl extends PeliculaRepository {

  constructor(private readonly datasource: PeliculaDatasource) { super(); }

  create(createPeliculaDto: CreatePeliculaDto): Promise<PeliculaEntity> {
    return this.datasource.create(createPeliculaDto);
  }

  getAll(): Promise<PeliculaEntity[]> {
    return this.datasource.getAll();
  }

  findById(id: number): Promise<PeliculaEntity> {
    return this.datasource.findById(id);
  }

  updateById(updatePeliculaDto: UpdatePeliculaDto): Promise<PeliculaEntity> {
    return this.datasource.updateById(updatePeliculaDto);
  }

  deleteById(id: number): Promise<PeliculaEntity> {
    return this.datasource.deleteById(id);
  }
}
