import { Router } from 'express';
import { TodosController } from './controller';
import { DatasourceConfig } from '../../infrastructure/datasource/datasource.config';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';

export class TodoRoutes {
    static get routes(): Router {
        const router = Router();

        // Usar el datasource configurado globalmente
        const datasource = DatasourceConfig.getDatasource();
        const todoRepository = new TodoRepositoryImpl(datasource);
        const todoController = new TodosController(todoRepository);

        router.get('/', todoController.getTodos);
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodo);
        router.delete('/:id', todoController.deleteTodo);

        return router;
    }
}

