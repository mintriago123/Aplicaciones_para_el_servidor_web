import { Router } from 'express';
import { TodosMemoryController } from './controller.memory';

export class TodoMemoryRoutes {

  static get routes(): Router {

    const router = Router();
    const todoController = new TodosMemoryController();

    // Rutas estándar de CRUD
    router.get('/', todoController.getTodos);
    router.get('/:id', todoController.getTodoById);
    router.post('/', todoController.createTodo);
    router.put('/:id', todoController.updateTodo);
    router.delete('/:id', todoController.deleteTodo);

    // Rutas específicas para gestión de datos en memoria
    router.get('/memory/stats', todoController.getStats);
    router.get('/memory/export', todoController.exportData);
    router.get('/memory/raw', todoController.getRawData);
    router.post('/memory/import', todoController.importData);
    router.post('/memory/reset', todoController.resetToSampleData);
    router.delete('/memory/clear', todoController.clearData);

    return router;
  }

} 