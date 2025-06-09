import { Router } from 'express';
import { PeliculasMemoryController } from './controller.memory';

export class PeliculaMemoryRoutes {

  static get routes(): Router {

    const router = Router();
    const peliculaController = new PeliculasMemoryController();

    // Rutas estándar de CRUD
    router.get('/', peliculaController.getPeliculas);
    router.get('/:id', peliculaController.getPeliculaById);
    router.post('/', peliculaController.createPelicula);
    router.put('/:id', peliculaController.updatePelicula);
    router.delete('/:id', peliculaController.deletePelicula);

    // Rutas específicas para gestión de datos en memoria
    router.get('/memory/stats', peliculaController.getStats);
    router.get('/memory/export', peliculaController.exportData);
    router.get('/memory/raw', peliculaController.getRawData);
    router.post('/memory/import', peliculaController.importData);
    router.post('/memory/reset', peliculaController.resetToSampleData);
    router.delete('/memory/clear', peliculaController.clearData);

    return router;
  }

}
