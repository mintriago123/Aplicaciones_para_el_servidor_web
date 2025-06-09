import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, UpdateTodo, TodoRepository, TodoEntity } from '../../domain';
import { DatasourceConfig, DatasourceType } from '../../infrastructure/datasource/datasource.config';
import { TodoMemoryDatasourceImpl } from '../../infrastructure/datasource/todo.memory.datasource.impl';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';

export class TodosMemoryController {

  private todoRepository: TodoRepository;
  private memoryDatasource: TodoMemoryDatasourceImpl;

  constructor() {
    // Asegurar que estamos usando el datasource de memoria
    DatasourceConfig.setDatasource(DatasourceType.MEMORY);
    this.memoryDatasource = DatasourceConfig.getDatasource(DatasourceType.MEMORY) as TodoMemoryDatasourceImpl;
    this.todoRepository = new TodoRepositoryImpl(this.memoryDatasource);
  }

  public getTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos: TodoEntity[]) => res.json(todos))
      .catch((error: any) => res.status(400).json({ error }));
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    
    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo: TodoEntity) => res.json(todo))
      .catch((error: any) => res.status(400).json({ error }));
  };

  public createTodo = (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo: TodoEntity) => res.status(201).json(todo))
      .catch((error: any) => res.status(400).json({ error }));
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then((todo: TodoEntity) => res.json(todo))
      .catch((error: any) => res.status(400).json({ error }));
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo: TodoEntity) => res.json(todo))
      .catch((error: any) => res.status(400).json({ error }));
  };

  // Métodos específicos para la gestión de datos en memoria

  /**
   * Obtiene estadísticas del datasource de memoria
   */
  public getStats = (req: Request, res: Response) => {
    try {
      const rawData = this.memoryDatasource.getRawData();
      const completed = rawData.filter(todo => todo.completedAt).length;
      const pending = rawData.filter(todo => !todo.completedAt).length;
      
      res.json({
        datasourceType: 'MEMORY',
        totalTodos: rawData.length,
        completedTodos: completed,
        pendingTodos: pending,
        nextId: rawData.length > 0 ? Math.max(...rawData.map(t => t.id)) + 1 : 1
      });
    } catch (error) {
      res.status(500).json({ error: 'Error getting memory stats' });
    }
  };

  /**
   * Exporta todos los datos como JSON
   */
  public exportData = (req: Request, res: Response) => {
    try {
      const jsonData = this.memoryDatasource.exportToJSON();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="todos-export.json"');
      res.send(jsonData);
    } catch (error) {
      res.status(500).json({ error: 'Error exporting data' });
    }
  };

  /**
   * Importa datos desde JSON
   */
  public importData = (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ error: 'Data field is required' });
      }

      if (typeof data === 'string') {
        this.memoryDatasource.importFromJSON(data);
      } else if (Array.isArray(data)) {
        this.memoryDatasource.importData(data);
      } else {
        return res.status(400).json({ error: 'Data must be a JSON string or array' });
      }

      res.json({
        message: 'Data imported successfully',
        count: this.memoryDatasource.getRawData().length
      });
    } catch (error) {
      res.status(400).json({ error: `Import failed: ${error}` });
    }
  };

  /**
   * Limpia todos los datos en memoria
   */
  public clearData = (req: Request, res: Response) => {
    try {
      this.memoryDatasource.clear();
      res.json({ message: 'All data cleared successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error clearing data' });
    }
  };

  /**
   * Obtiene los datos raw (objetos literales) sin convertir a entidades
   */
  public getRawData = (req: Request, res: Response) => {
    try {
      const rawData = this.memoryDatasource.getRawData();
      res.json({
        data: rawData,
        count: rawData.length,
        datasourceType: 'MEMORY'
      });
    } catch (error) {
      res.status(500).json({ error: 'Error getting raw data' });
    }
  };

  /**
   * Reinicia con datos de ejemplo
   */
  public resetToSampleData = (req: Request, res: Response) => {
    try {
      // Crear un nuevo datasource con datos de ejemplo
      const newDatasource = DatasourceConfig.createMemoryDatasource();
      
      // Actualizar las referencias
      this.memoryDatasource = newDatasource;
      this.todoRepository = new TodoRepositoryImpl(this.memoryDatasource);
      DatasourceConfig.setDatasource(DatasourceType.MEMORY);

      res.json({
        message: 'Data reset to sample data successfully',
        count: this.memoryDatasource.getRawData().length
      });
    } catch (error) {
      res.status(500).json({ error: 'Error resetting to sample data' });
    }
  };
} 