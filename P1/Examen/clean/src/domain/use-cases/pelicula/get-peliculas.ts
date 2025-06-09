import { PeliculaEntity } from '../../entities/pelicula.entity';
import { PeliculaRepository } from '../../repositories/pelicula.repository';




export interface GetPeliculasUseCase {
  execute(): Promise<PeliculaEntity[]>
}


export class GetPeliculas implements GetPeliculasUseCase {
  
  constructor(
    private readonly repository: PeliculaRepository,
  ) {}
  
  execute(): Promise<PeliculaEntity[]> {
    return this.repository.getAll();
  }

}

