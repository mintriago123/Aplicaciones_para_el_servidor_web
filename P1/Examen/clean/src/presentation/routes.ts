import { Router } from 'express';
import { Request, Response } from 'express';

import { TodoRoutes } from './todos/routes';
import { TodoMemoryRoutes } from './todos/routes.memory';

import { PeliculaRoutes } from './pelicula/routes';
import { PeliculaMemoryRoutes } from './pelicula/routes.memory';

import { DatasourceConfig, DatasourceType } from '../infrastructure/datasource/datasource.config';


export class AppRoutes {

  static get routes(): Router {

    const router = Router();

    // Todos endpoints
    router.use('/api/todos', TodoRoutes.routes);
    router.use('/api/todos-memory', TodoMemoryRoutes.routes);

    // Peliculas endpoints
    router.use('/api/peliculas', PeliculaRoutes.routes);
    router.use('/api/peliculas-memory', PeliculaMemoryRoutes.routes);

    // Endpoint de sistema para gestión de datasource
    router.get('/api/system/info', (req: Request, res: Response) => {
      res.json({
        message: 'Clean Architecture API',
        version: '1.0.0',
        datasources: {
          todos: DatasourceConfig.getCurrentDatasourceType(),
          peliculas: DatasourceConfig.getCurrentDatasourceType(),
        },
        availableDatasources: Object.values(DatasourceType),
        endpoints: {
          todos: {
            unified: '/api/todos (uses configured datasource)',
            memory: '/api/todos-memory (always uses memory)'
          },
          peliculas: {
            unified: '/api/peliculas (uses configured datasource)',
            memory: '/api/peliculas-memory (always uses memory)'
          },
          system: '/api/system/info'
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV || 'development',
          DATASOURCE_TYPE: process.env.DATASOURCE_TYPE || 'MEMORY'
        }
      });
    });

    // Endpoint para cambiar datasource de todos en tiempo de ejecución (solo para desarrollo)
    router.post('/api/system/datasource/todos', (req: Request, res: Response) => {
      try {
        const { type } = req.body;

        if (!type || !Object.values(DatasourceType).includes(type)) {
          return res.status(400).json({
            error: 'Invalid datasource type',
            availableTypes: Object.values(DatasourceType)
          });
        }

        const previousType = DatasourceConfig.getCurrentDatasourceType();
        DatasourceConfig.setDatasource(type);

        res.json({
          message: 'Todo datasource changed successfully',
          previousType,
          newType: DatasourceConfig.getCurrentDatasourceType(),
          note: 'This change affects /api/todos endpoints. /api/todos-memory always uses memory datasource.'
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to change todo datasource',
          details: error
        });
      }
    });

    // Endpoint para cambiar datasource de peliculas en tiempo de ejecución (solo para desarrollo)
    router.post('/api/system/datasource/peliculas', (req: Request, res: Response) => {
      try {
        const { type } = req.body;

        if (!type || !Object.values(DatasourceType).includes(type)) {
          return res.status(400).json({
            error: 'Invalid datasource type',
            availableTypes: Object.values(DatasourceType)
          });
        }

        const previousType = DatasourceConfig.getCurrentDatasourceType();
        DatasourceConfig.setDatasource(type);

        res.json({
          message: 'Pelicula datasource changed successfully',
          previousType,
          newType: DatasourceConfig.getCurrentDatasourceType(),
          note: 'This change affects /api/peliculas endpoints. /api/peliculas-memory always uses memory datasource.'
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to change pelicula datasource',
          details: error
        });
      }
    });

    return router;
  }

}
