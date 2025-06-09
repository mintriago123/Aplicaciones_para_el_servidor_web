import { PeliculaEntity } from '../../entities/pelicula.entity';
import { PeliculaRepository } from '../../repositories/pelicula.repository';

export interface GetPeliculaUseCase {
  execute( id: number ): Promise<PeliculaEntity>
}


export class GetPelicula implements GetPeliculaUseCase {
  
  constructor(
    private readonly repository: PeliculaRepository,
  ) {}
  
  execute( id: number ): Promise<PeliculaEntity> {
    return this.repository.findById(id);
  }

}

