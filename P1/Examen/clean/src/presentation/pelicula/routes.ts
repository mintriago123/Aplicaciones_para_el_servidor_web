import { Router } from 'express';
import { PeliculasController } from './controller';
import { DatasourceConfig } from '../../infrastructure/datasource/datasource.config';
import { PeliculaRepositoryImpl } from '../../infrastructure/repositories/pelicula.repository.impl';

export class PeliculaRoutes {
    static get routes(): Router {
        const router = Router();

        // Usar el datasource configurado globalmente
        const datasource = DatasourceConfig.getDatasource();
        const peliculaRepository = new PeliculaRepositoryImpl(datasource);
        const peliculaController = new PeliculasController(peliculaRepository);

        router.get('/', peliculaController.getPeliculas);
        router.get('/:id', peliculaController.getPeliculaById);
        router.post('/', peliculaController.createPelicula);
        router.put('/:id', peliculaController.updatePelicula);
        router.delete('/:id', peliculaController.deletePelicula);

        return router;
    }
}
