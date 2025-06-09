import { TodoDatasource } from '../../domain';
import { PeliculaDatasource } from '../../domain';
import { PeliculaMemoryDatasourceImpl } from './pelicula.memory.datasource.impl';
import { TodoDatasourceImpl } from './todo.datasource.impl';
import { TodoTypeOrmDatasourceImpl } from './todo.typeorm.datasource.impl';
import { TodoMemoryDatasourceImpl } from './todo.memory.datasource.impl';

export enum DatasourceType {
    PRISMA = 'prisma',
    TYPEORM = 'typeorm',
    MEMORY = 'memory'
}

// Datos de ejemplo para inicializar el datasource de memoria
const SAMPLE_TODOS = [
    {
        id: 1,
        text: 'Completar el proyecto de arquitectura limpia',
        completedAt: null
    },
    {
        id: 2,
        text: 'Implementar tests unitarios',
        completedAt: new Date('2024-01-15')
    },
    {
        id: 3,
        text: 'Documentar la API',
        completedAt: null
    },
    {
        id: 4,
        text: 'Revisar el código con el equipo',
        completedAt: new Date('2024-01-10')
    }
];
const SAMPLE_PELICULAS = [
    { id: 1, titulo: 'Inception', director: 'Christopher Nolan', anio: 2010 },
    { id: 2, titulo: 'The Matrix', director: 'The Wachowskis', anio: 1999 },
    { id: 3, titulo: 'Interstellar', director: 'Christopher Nolan', anio: 2014 }
];

export class DatasourceConfig {
    private static instance: TodoDatasource;
    private static peliculaInstance: PeliculaDatasource;


    // static getDatasource(type: DatasourceType = DatasourceType.PRISMA): TodoDatasource {
    //     if (!this.instance) {
    //         this.instance = this.createDatasource(type);
    //     }
    //     return this.instance;
    // }

    static setDatasource(type: DatasourceType): void {
        this.instance = this.createDatasource(type);
    }

    /**
     * Crea un nuevo datasource de memoria con datos opcionales
     */
    static createMemoryDatasource(initialData?: any[]): TodoMemoryDatasourceImpl {
        return new TodoMemoryDatasourceImpl(initialData || SAMPLE_TODOS);
    }

    /**
     * Crea un datasource de memoria vacío
     */
    static createEmptyMemoryDatasource(): TodoMemoryDatasourceImpl {
        return new TodoMemoryDatasourceImpl([]);
    }

    private static createDatasource(type: DatasourceType): TodoDatasource {
        switch (type) {
            case DatasourceType.TYPEORM:
                return new TodoTypeOrmDatasourceImpl();
            case DatasourceType.MEMORY:
                return this.createMemoryDatasource();
            case DatasourceType.PRISMA:
            default:
                return new TodoDatasourceImpl();
        }
    }

    // /**
    //  * Obtiene el tipo de datasource actual
    //  */
    static getCurrentDatasourceType(): string {
        if (this.instance instanceof TodoMemoryDatasourceImpl) {
            return 'MEMORY';
        } else if (this.instance instanceof TodoTypeOrmDatasourceImpl) {
            return 'TYPEORM';
        } else {
            return 'PRISMA';
        }
    }


      static getPeliculaDatasource(type: DatasourceType = DatasourceType.MEMORY): PeliculaDatasource {
    if (!this.peliculaInstance) {
      this.peliculaInstance = this.createPeliculaDatasource(type);
    }
    return this.peliculaInstance;
  }

  // Métodos para crear instancias específicas
  private static createTodoDatasource(type: DatasourceType): TodoDatasource {
    switch (type) {
      case DatasourceType.TYPEORM:
        return new TodoTypeOrmDatasourceImpl();
      case DatasourceType.MEMORY:
        return new TodoMemoryDatasourceImpl();
      case DatasourceType.PRISMA:
      default:
        return new TodoDatasourceImpl();
    }
  }


    static getDatasource(type: DatasourceType = DatasourceType.PRISMA): TodoDatasource {
    if (!this.instance) {
            this.instance = this.createDatasource(type);
    }
    return this.instance;
  }

//     static getPeliculaDatasource(type: DatasourceType = DatasourceType.MEMORY): PeliculaDatasource {
//     if (!this.peliculaInstance) {
//         this.peliculaInstance = this.createPeliculaDatasource(type);
//     }
//     return this.peliculaInstance;
// }

static setPeliculaDatasource(type: DatasourceType): void {
    this.peliculaInstance = this.createPeliculaDatasource(type);
}

static createMemoryPeliculaDatasource(initialData?: any[]): PeliculaMemoryDatasourceImpl {
    return new PeliculaMemoryDatasourceImpl(initialData || SAMPLE_PELICULAS);
}


    static createPeliculaDatasource(type: DatasourceType): PeliculaDatasource {
  switch (type) {
    case DatasourceType.MEMORY:
      return new PeliculaMemoryDatasourceImpl();
    case DatasourceType.PRISMA:
      throw new Error('PRISMA datasource for Peliculas not implemented');
    case DatasourceType.TYPEORM:
      throw new Error('TYPEORM datasource for Peliculas not implemented');
    default:
      throw new Error('Datasource type not supported for Peliculas');
  }
}
    static getCurrentPeliculaDatasourceType(): string {
        if (this.peliculaInstance instanceof PeliculaMemoryDatasourceImpl) {
            return 'MEMORY';
        }
        return 'UNKNOWN';
    }



} 