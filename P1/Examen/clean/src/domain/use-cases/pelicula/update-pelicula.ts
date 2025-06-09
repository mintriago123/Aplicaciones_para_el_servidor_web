import { UpdatePeliculaDto } from '../../dtos';
import { PeliculaEntity } from '../../entities/pelicula.entity';
import { PeliculaRepository } from '../../repositories/pelicula.repository';

export interface UpdatePeliculaUseCase {
  execute( dto: UpdatePeliculaDto ): Promise<PeliculaEntity>
}


export class UpdatePelicula implements UpdatePeliculaUseCase {
  
  constructor(
    private readonly repository: PeliculaRepository,
  ) {}
  
  execute( dto: UpdatePeliculaDto ): Promise<PeliculaEntity> {
    return this.repository.updateById(dto);
  }

}

