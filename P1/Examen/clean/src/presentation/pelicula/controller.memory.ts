import { Request, Response } from 'express';
import {
  CreatePeliculaDto,
  UpdatePeliculaDto,
  PeliculaEntity,
  PeliculaRepository,
  CreatePelicula,
  DeletePelicula,
  GetPelicula,
  GetPeliculas,
  UpdatePelicula,
} from '../../domain';

import {
  DatasourceConfig,
  DatasourceType,
} from '../../infrastructure/datasource/datasource.config';

import { PeliculaMemoryDatasourceImpl } from '../../infrastructure/datasource/pelicula.memory.datasource.impl';
import { PeliculaRepositoryImpl } from '../../infrastructure/repositories/pelicula.repository.impl';

export class PeliculasMemoryController {
  private peliculaRepository: PeliculaRepository;
  private memoryDatasource: PeliculaMemoryDatasourceImpl;

    constructor() {
    this.memoryDatasource = DatasourceConfig.getPeliculaDatasource(DatasourceType.MEMORY) as PeliculaMemoryDatasourceImpl;
    this.peliculaRepository = new PeliculaRepositoryImpl(this.memoryDatasource);
    }


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
      .then(pelicula => res.status(201).json(pelicula))
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

  public getStats = (req: Request, res: Response) => {
    try {
      const rawData = this.memoryDatasource.getRawData();
      const total = rawData.length;

      res.json({
        datasourceType: 'MEMORY',
        totalPeliculas: total,
        nextId: total > 0 ? Math.max(...rawData.map(p => p.id)) + 1 : 1,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error getting memory stats' });
    }
  };

  public exportData = (req: Request, res: Response) => {
    try {
      const jsonData = this.memoryDatasource.exportToJSON();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="peliculas-export.json"');
      res.send(jsonData);
    } catch (error) {
      res.status(500).json({ error: 'Error exporting data' });
    }
  };

  public importData = (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ error: 'Data field is required' });

      if (typeof data === 'string') {
        this.memoryDatasource.importFromJSON(data);
      } else if (Array.isArray(data)) {
        this.memoryDatasource.importData(data);
      } else {
        return res.status(400).json({ error: 'Data must be a JSON string or array' });
      }

      res.json({
        message: 'Data imported successfully',
        count: this.memoryDatasource.getRawData().length,
      });
    } catch (error) {
      res.status(400).json({ error: `Import failed: ${error}` });
    }
  };

  public clearData = (req: Request, res: Response) => {
    try {
      this.memoryDatasource.clear();
      res.json({ message: 'All data cleared successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error clearing data' });
    }
  };

  public getRawData = (req: Request, res: Response) => {
    try {
      const rawData = this.memoryDatasource.getRawData();
      res.json({
        data: rawData,
        count: rawData.length,
        datasourceType: 'MEMORY',
      });
    } catch (error) {
      res.status(500).json({ error: 'Error getting raw data' });
    }
  };

    public resetToSampleData = (req: Request, res: Response) => {
    try {
        const newDatasource = DatasourceConfig.createMemoryPeliculaDatasource(DatasourceType.MEMORY);
        this.memoryDatasource = newDatasource as PeliculaMemoryDatasourceImpl;
        this.peliculaRepository = new PeliculaRepositoryImpl(this.memoryDatasource);
        DatasourceConfig.setPeliculaDatasource(DatasourceType.MEMORY);

        res.json({
        message: 'Data reset to sample data successfully',
        count: this.memoryDatasource.getRawData().length,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting to sample data' });
    }
    };

}
