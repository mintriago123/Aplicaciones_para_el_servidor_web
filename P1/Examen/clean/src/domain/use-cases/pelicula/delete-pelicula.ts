import { PeliculaEntity } from '../../entities/pelicula.entity';
import { PeliculaRepository } from '../../repositories/pelicula.repository';


export interface DeletePeliculaUseCase {
  execute( id: number ): Promise<PeliculaEntity>
}


export class DeletePelicula implements DeletePeliculaUseCase {
  
  constructor(
    private readonly repository: PeliculaRepository,
  ) {}
  
  execute( id: number ): Promise<PeliculaEntity> {
    return this.repository.deleteById(id);
  }

}

