import { Request, Response } from 'express';
import { CreatePeliculaDto, UpdatePeliculaDto } from '../../domain/dtos';
import { CreatePelicula, DeletePelicula, GetPelicula, GetPeliculas, PeliculaRepository, UpdatePelicula } from '../../domain';

export class PeliculasController {

  constructor(
    private readonly peliculaRepository: PeliculaRepository,
  ) {}

  public getPeliculas = (req: Request, res: Response) => {

    new GetPeliculas(this.peliculaRepository)
      .execute()
      .then(peliculas => res.json(peliculas))
      .catch(error => res.status(400).json({ error }));
  };

  public getPeliculaById = (req: Request, res: Response) => {
    const id = +req.params.id;

    new GetPelicula(this.peliculaRepository)
      .execute(id)
      .then(pelicula => res.json(pelicula))
      .catch(error => res.status(400).json({ error }));
  };

  public createPelicula = (req: Request, res: Response) => {
    const [error, createPeliculaDto] = CreatePeliculaDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreatePelicula(this.peliculaRepository)
      .execute(createPeliculaDto!)
      .then(pelicula => res.json(pelicula))
      .catch(error => res.status(400).json({ error }));
  };

  public updatePelicula = (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updatePeliculaDto] = UpdatePeliculaDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    new UpdatePelicula(this.peliculaRepository)
      .execute(updatePeliculaDto!)
      .then(pelicula => res.json(pelicula))
      .catch(error => res.status(400).json({ error }));
  };

  public deletePelicula = (req: Request, res: Response) => {
    const id = +req.params.id;

    new DeletePelicula(this.peliculaRepository)
      .execute(id)
      .then(pelicula => res.json(pelicula))
      .catch(error => res.status(400).json({ error }));
  };

}
