# Memory Datasource - Arquitectura Limpia con Arreglos de Objetos Literales

Esta implementación extiende la arquitectura limpia existente para soportar el almacenamiento de datos en memoria usando arreglos de objetos literales de JavaScript, además de las opciones existentes con Prisma y TypeORM.

## Características

### 1. **Arquitectura Limpia Completa**
- Mantiene la separación de capas (Domain, Infrastructure, Presentation)
- Implementa las mismas interfaces que los datasources de Prisma y TypeORM
- Permite intercambiar entre diferentes tipos de datasource sin cambiar el código de negocio

### 2. **Funcionalidad Estándar CRUD**
- Crear todos
- Obtener todos los todos
- Obtener todo por ID
- Actualizar todo
- Eliminar todo

### 3. **Funcionalidades Adicionales de Memoria**
- Exportar datos como JSON
- Importar datos desde JSON o arreglo
- Limpiar todos los datos
- Obtener estadísticas
- Reiniciar con datos de ejemplo
- Acceder a datos raw (objetos literales)

## Configuración

### Tipos de Datasource Disponibles

```typescript
export enum DatasourceType {
    PRISMA = 'prisma',
    TYPEORM = 'typeorm',
    MEMORY = 'memory'
}
```

### Cambiar a Datasource de Memoria

```typescript
import { DatasourceConfig, DatasourceType } from './infrastructure/datasource/datasource.config';

// Cambiar a datasource de memoria con datos de ejemplo
DatasourceConfig.setDatasource(DatasourceType.MEMORY);

// Crear datasource de memoria vacío
const emptyDatasource = DatasourceConfig.createEmptyMemoryDatasource();

// Crear datasource de memoria con datos personalizados
const customData = [
  { id: 1, text: 'Mi primer todo', completedAt: null },
  { id: 2, text: 'Todo completado', completedAt: new Date() }
];
const customDatasource = DatasourceConfig.createMemoryDatasource(customData);
```

## API Endpoints

### Endpoints Estándar CRUD
Base URL: `/api/todos-memory`

- `GET /` - Obtener todos los todos
- `GET /:id` - Obtener todo por ID
- `POST /` - Crear nuevo todo
- `PUT /:id` - Actualizar todo
- `DELETE /:id` - Eliminar todo

### Endpoints Específicos de Memoria

#### Obtener Estadísticas
```http
GET /api/todos-memory/memory/stats
```
Respuesta:
```json
{
  "datasourceType": "MEMORY",
  "totalTodos": 4,
  "completedTodos": 2,
  "pendingTodos": 2,
  "nextId": 5
}
```

#### Exportar Datos
```http
GET /api/todos-memory/memory/export
```
Descarga un archivo JSON con todos los datos.

#### Obtener Datos Raw
```http
GET /api/todos-memory/memory/raw
```
Respuesta:
```json
{
  "data": [
    {
      "id": 1,
      "text": "Completar el proyecto de arquitectura limpia",
      "completedAt": null
    },
    {
      "id": 2,
      "text": "Implementar tests unitarios",
      "completedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "count": 2,
  "datasourceType": "MEMORY"
}
```

#### Importar Datos
```http
POST /api/todos-memory/memory/import
Content-Type: application/json

{
  "data": [
    {
      "id": 1,
      "text": "Nuevo todo",
      "completedAt": null
    }
  ]
}
```

#### Limpiar Datos
```http
DELETE /api/todos-memory/memory/clear
```

#### Reiniciar con Datos de Ejemplo
```http
POST /api/todos-memory/memory/reset
```

## Ejemplos de Uso

### 1. Crear un Todo
```http
POST /api/todos-memory
Content-Type: application/json

{
  "text": "Implementar nueva funcionalidad"
}
```

### 2. Actualizar un Todo
```http
PUT /api/todos-memory/1
Content-Type: application/json

{
  "text": "Funcionalidad implementada",
  "completedAt": "2024-01-20T10:30:00.000Z"
}
```

### 3. Importar Datos desde JSON
```http
POST /api/todos-memory/memory/import
Content-Type: application/json

{
  "data": "[{\"id\":1,\"text\":\"Todo desde JSON\",\"completedAt\":null}]"
}
```

## Estructura de Datos

### TodoMemoryModel (Objeto Literal)
```typescript
interface TodoMemoryModel {
  id: number;
  text: string;
  completedAt?: Date | null;
}
```

### TodoEntity (Entidad de Dominio)
```typescript
export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date | null
  ) {}

  get isCompleted() {
    return !!this.completedAt;
  }
}
```

## Ventajas del Datasource de Memoria

1. **Desarrollo Rápido**: No requiere configuración de base de datos
2. **Testing**: Ideal para pruebas unitarias e integración
3. **Prototipado**: Perfecto para crear prototipos rápidos
4. **Portabilidad**: Los datos pueden exportarse/importarse fácilmente
5. **Rendimiento**: Acceso muy rápido a los datos en memoria
6. **Arquitectura Limpia**: Mantiene todos los principios de la arquitectura limpia

## Limitaciones

1. **Persistencia**: Los datos se pierden al reiniciar la aplicación
2. **Escalabilidad**: Limitado por la memoria disponible
3. **Concurrencia**: No maneja múltiples instancias de la aplicación
4. **Transacciones**: No soporta transacciones complejas

## Casos de Uso Recomendados

- **Desarrollo local** sin configurar base de datos
- **Testing** unitario e integración
- **Demos** y prototipos
- **Ambientes de prueba** temporal
- **Aplicaciones pequeñas** con pocos datos
- **Migración temporal** entre diferentes bases de datos 