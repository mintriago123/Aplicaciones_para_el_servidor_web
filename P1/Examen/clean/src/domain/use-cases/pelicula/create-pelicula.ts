import { CreatePeliculaDto } from '../../dtos';
import { PeliculaEntity } from '../../entities/pelicula.entity';
import { PeliculaRepository } from '../../repositories/pelicula.repository';

export interface CreatePeliculaUseCase {
  execute( dto: CreatePeliculaDto ): Promise<PeliculaEntity>
}


export class CreatePelicula implements CreatePeliculaUseCase {
  
  constructor(
    private readonly repository: PeliculaRepository,
  ) {}
  
  execute( dto: CreatePeliculaDto ): Promise<PeliculaEntity> {
    return this.repository.create(dto);
  }

}