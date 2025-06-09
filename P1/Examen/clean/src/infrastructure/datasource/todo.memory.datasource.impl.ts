import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from '../../domain';

// Tipo para los objetos literales que representan Todos en memoria
interface TodoMemoryModel {
  id: number;
  text: string;
  completedAt?: Date | null;
}

export class TodoMemoryDatasourceImpl implements TodoDatasource {
  
  // Arreglo en memoria para almacenar los todos
  private todos: TodoMemoryModel[] = [];
  private nextId: number = 1;

  constructor(initialTodos: TodoMemoryModel[] = []) {
    // Permitir inicializar con datos predeterminados
    this.todos = [...initialTodos];
    // Calcular el siguiente ID basado en los datos existentes
    if (this.todos.length > 0) {
      this.nextId = Math.max(...this.todos.map(todo => todo.id)) + 1;
    }
  }

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const newTodo: TodoMemoryModel = {
      id: this.nextId++,
      text: createTodoDto.text,
      completedAt: null
    };

    this.todos.push(newTodo);
    return TodoEntity.fromObject(newTodo);
  }

  async getAll(): Promise<TodoEntity[]> {
    return this.todos.map(todo => TodoEntity.fromObject(todo));
  }

  async findById(id: number): Promise<TodoEntity> {
    const todo = this.todos.find(t => t.id === id);
    
    if (!todo) throw `Todo with id ${id} not found`;
    return TodoEntity.fromObject(todo);
  }

  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todoIndex = this.todos.findIndex(t => t.id === updateTodoDto.id);
    
    if (todoIndex === -1) throw `Todo with id ${updateTodoDto.id} not found`;

    // Actualizar solo los campos que vienen en values
    const currentTodo = this.todos[todoIndex];
    const updatedTodo = {
      ...currentTodo,
      ...updateTodoDto.values
    };

    this.todos[todoIndex] = updatedTodo;
    return TodoEntity.fromObject(updatedTodo);
  }

  async deleteById(id: number): Promise<TodoEntity> {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) throw `Todo with id ${id} not found`;

    const deletedTodo = this.todos[todoIndex];
    this.todos.splice(todoIndex, 1);
    
    return TodoEntity.fromObject(deletedTodo);
  }

  // Métodos adicionales para gestión de datos en memoria
  
  /**
   * Obtiene todos los datos como objetos literales (útil para debugging/testing)
   */
  public getRawData(): TodoMemoryModel[] {
    return [...this.todos];
  }

  /**
   * Limpia todos los datos en memoria
   */
  public clear(): void {
    this.todos = [];
    this.nextId = 1;
  }

  /**
   * Importa datos desde un arreglo de objetos literales
   */
  public importData(data: TodoMemoryModel[]): void {
    this.todos = [...data];
    if (this.todos.length > 0) {
      this.nextId = Math.max(...this.todos.map(todo => todo.id)) + 1;
    } else {
      this.nextId = 1;
    }
  }

  /**
   * Exporta los datos actuales como JSON
   */
  public exportToJSON(): string {
    return JSON.stringify(this.todos, null, 2);
  }

  /**
   * Importa datos desde JSON
   */
  public importFromJSON(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        this.importData(data);
      } else {
        throw new Error('JSON data must be an array of todos');
      }
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error}`);
    }
  }
} 