# AgroSense GraphQL API

Este proyecto es una API GraphQL desarrollada con NestJS y TypeORM que permite gestionar cultivos, plagas y datos de exportación de productos agrícolas. Está basada en una arquitectura por capas, aplicando buenas prácticas de diseño de software moderno.

## 📘 Descripción del Proyecto

La API permite:
- Registrar y consultar información sobre cultivos agrícolas.
- Gestionar plagas que afectan diferentes regiones.
- Llevar control de productos agrícolas exportables.

## ⚙️ Arquitectura

- **Framework**: NestJS
- **Base de datos**: SQLite
- **ORM**: TypeORM
- **API**: GraphQL (Code First) con Apollo Server
- **Validación**: class-validator

## 🚀 Instalación y Ejecución

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd nombre-del-proyecto

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev
```

Accede a GraphQL Playground en: [http://localhost:3000/graphql](http://localhost:3000/graphql)

---

## 🧱 Entidades del Proyecto

### 1. Cultivo
- `id`: number
- `nombre`: string
- `tipo`: string
- `temporada`: string
- `region`: string

### 2. Plaga
- `id`: number
- `nombre`: string
- `tipo`: string
- `regionAfectada`: string
- `nivelRiesgo`: string

### 3. DatoAExportar
- `id`: number
- `producto`: string
- `cantidad`: number
- `destino`: string
- `fechaExportacion`: string

---

## 🧪 Ejemplos de Queries y Mutations

### Crear un Cultivo

```graphql
mutation {
  createCultivo(createCultivoInput: {
    nombre: "Papa",
    tipo: "Tubérculo",
    temporada: "Invierno",
    region: "Sierra"
  }) {
    id
    nombre
  }
}
```

### Consultar todos los cultivos

```graphql
query {
  cultivos {
    id
    nombre
    tipo
    temporada
    region
  }
}
```

### Crear una Plaga

```graphql
mutation {
  createPlaga(createPlagaInput: {
    nombre: "Mosca Blanca",
    tipo: "Insecto",
    regionAfectada: "Costa",
    nivelRiesgo: "Alto"
  }) {
    id
    nombre
  }
}
```

### Crear un DatoAExportar

```graphql
mutation {
  createDatoAExportar(createDatoAExportarInput: {
    producto: "Cacao",
    cantidad: 150,
    destino: "Alemania",
    fechaExportacion: "2025-07-05"
  }) {
    id
    producto
  }
}
```

---

## 📁 Estructura del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── cultivo/
│   ├── cultivo.module.ts
│   ├── cultivo.service.ts
│   ├── cultivo.resolver.ts
│   ├── dto/
│   │   ├── create-cultivo.input.ts
│   │   └── update-cultivo.input.ts
│   └── entities/
│       └── cultivo.entity.ts
├── plaga/
│   ├── plaga.module.ts
│   ├── plaga.service.ts
│   ├── plaga.resolver.ts
│   ├── dto/
│   │   ├── create-plaga.input.ts
│   │   └── update-plaga.input.ts
│   └── entities/
│       └── plaga.entity.ts
├── dato-aexportar/
│   ├── dato-aexportar.module.ts
│   ├── dato-aexportar.service.ts
│   ├── dato-aexportar.resolver.ts
│   ├── dto/
│   │   ├── create-dato-aexportar.input.ts
│   │   └── update-dato-aexportar.input.ts
│   └── entities/
│       └── dato-aexportar.entity.ts
```

---

## 📌 Notas

- El esquema GraphQL se genera automáticamente (`schema.gql`)
- Base de datos SQLite (`db.sqlite`) se crea automáticamente
- Se siguen principios de arquitectura limpia: separación de datos, lógica y API
- Validaciones aplicadas en DTOs para todos los inputs

## 👨‍💻 Autor

Michael Intriago  
Práctica #2 — Aplicación para el Servidor Web  
Carrera de Software — Nivel Quinto  
Docente: John Cevallos  
Periodo: 2025-2026 (1)