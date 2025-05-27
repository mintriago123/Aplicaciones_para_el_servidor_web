# AgroSense API

API REST construida con [NestJS](https://nestjs.com/) y [SQLite](https://www.sqlite.org/index.html) para la gestión de cultivos, plagas y datos de exportación.

## 📦 Características

- CRUD completo para 3 entidades: `cultivo`, `plaga`, y `dato-aexportar`
- Documentación automática con Swagger
- Base de datos ligera en SQLite
- Versionado de rutas: todos los endpoints están bajo `/api/v1`

## 🚀 Requisitos

- Node.js (versión LTS recomendada)
- npm (incluido con Node.js)

## ⚙️ Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/agrosense-api.git
cd agrosense-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor en modo desarrollo:

```bash
npm run start:dev
```

> Esto iniciará el servidor en `http://localhost:3000`

## 🧪 Endpoints de la API

Todos los endpoints están bajo el prefijo:

```
http://localhost:3000/api/v1
```

### Cultivo

- `POST /cultivo`
- `GET /cultivo`
- `GET /cultivo/:id`
- `PATCH /cultivo/:id`
- `DELETE /cultivo/:id`

### Plaga

- `POST /plaga`
- `GET /plaga`
- `GET /plaga/:id`
- `PATCH /plaga/:id`
- `DELETE /plaga/:id`

### Dato a Exportar

- `POST /dato-aexportar`
- `GET /dato-aexportar`
- `GET /dato-aexportar/:id`
- `PATCH /dato-aexportar/:id`
- `DELETE /dato-aexportar/:id`

## 📚 Documentación Swagger

Una vez ejecutado el servidor, puedes acceder a la documentación Swagger aquí:

```
http://localhost:3000/api
```

## 📬 Colección Postman

Puedes importar la colección Postman desde el archivo:

📁 `agrosense-api.postman_collection.json`

Este archivo contiene ejemplos para probar los 15 endpoints (5 por cada entidad).

## 🌀 Ejemplos con curl

Puedes probar los endpoints también desde la terminal con los siguientes comandos curl:

### 🌱 Cultivo

```bash
# Crear cultivo
curl -X POST http://localhost:3000/api/v1/cultivo \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Papa", "tipo": "Tubérculo", "temporada": "Invierno", "region": "Sierra"}'

# Obtener todos los cultivos
curl http://localhost:3000/api/v1/cultivo

# Obtener un cultivo por ID
curl http://localhost:3000/api/v1/cultivo/1

# Actualizar un cultivo
curl -X PATCH http://localhost:3000/api/v1/cultivo/1 \
  -H "Content-Type: application/json" \
  -d '{"region": "Costa"}'

# Eliminar un cultivo
curl -X DELETE http://localhost:3000/api/v1/cultivo/1
```

### 🐛 Plaga

```bash
# Crear plaga
curl -X POST http://localhost:3000/api/v1/plaga \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Mosca Blanca", "tipo": "Insecto", "regionAfectada": "Costa", "nivelRiesgo": "Alto"}'

# Obtener todas las plagas
curl http://localhost:3000/api/v1/plaga

# Obtener una plaga por ID
curl http://localhost:3000/api/v1/plaga/1

# Actualizar una plaga
curl -X PATCH http://localhost:3000/api/v1/plaga/1 \
  -H "Content-Type: application/json" \
  -d '{"nivelRiesgo": "Moderado"}'

# Eliminar una plaga
curl -X DELETE http://localhost:3000/api/v1/plaga/1
```

### 📦 Dato a Exportar

```bash
# Crear dato a exportar
curl -X POST http://localhost:3000/api/v1/dato-aexportar \
  -H "Content-Type: application/json" \
  -d '{"producto": "Cacao", "cantidad": 200, "destino": "Alemania", "fechaExportacion": "2025-07-10"}'

# Obtener todos los datos a exportar
curl http://localhost:3000/api/v1/dato-aexportar

# Obtener uno por ID
curl http://localhost:3000/api/v1/dato-aexportar/1

# Actualizar un dato a exportar
curl -X PATCH http://localhost:3000/api/v1/dato-aexportar/1 \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 250}'

# Eliminar un dato a exportar
curl -X DELETE http://localhost:3000/api/v1/dato-aexportar/1
```

## 👨‍💻 Autor

Michael Intriago 
