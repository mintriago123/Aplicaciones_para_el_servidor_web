# AgroSense WebSocket API

Este proyecto es una API desarrollada con **NestJS** y **TypeORM** que permite gestionar cultivos, plagas y datos de exportación de productos agrícolas, implementando un CRUD en **tiempo real** usando **WebSockets (Socket.IO)**. Toda la información se persiste en **SQLite** y las actualizaciones se notifican a todos los clientes conectados.

---

## 📘 Descripción del Proyecto

La API WebSocket permite:
- Registrar y consultar información sobre cultivos agrícolas.
- Gestionar plagas que afectan diferentes regiones.
- Llevar control de productos agrícolas exportables.

---

## ⚙️ Arquitectura

- **Framework**: NestJS
- **Base de datos**: SQLite
- **ORM**: TypeORM
- **Comunicación**: WebSocket (Socket.IO)
- **Validación**: class-validator

---

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

El servidor WebSocket estará disponible en:  
`ws://localhost:3000` (o el puerto configurado)

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
- `nombre`: string
- `descripcion`: string
- `fecha`: string

---

## 🧪 Pruebas WebSocket con Postman

> **Importante:**  
> - Postman versión 10+ soporta WebSocket y Socket.IO nativamente.
> - NO uses la opción HTTP ni REST.
> - Selecciona “New WebSocket Request” y elige el tipo **Socket.IO**.

### 1. Abrir una conexión

- Haz clic en **New → WebSocket Request** en Postman.
- En el campo de URL coloca:  
  `ws://localhost:3000`
- Postman detectará automáticamente que es una conexión Socket.IO.

### 2. Enviar eventos

En la pestaña **Messages**, escribe el mensaje JSON según la operación y presiona **Send**.

#### 📦 CULTIVO

##### Crear Cultivo
```json
{
  "event": "createCultivo",
  "data": {
    "nombre": "Trigo",
    "tipo": "Cereal",
    "temporada": "Invierno",
    "region": "Andalucía"
  }
}
```
##### Listar Cultivos
```json
{ "event": "listCultivo" }
```
##### Actualizar Cultivo
```json
{
  "event": "updateCultivo",
  "data": {
    "id": 1,
    "dto": {
      "nombre": "Maíz",
      "tipo": "Cereal",
      "temporada": "Verano",
      "region": "Costa"
    }
  }
}
```
##### Eliminar Cultivo
```json
{ "event": "deleteCultivo", "data": 1 }
```

---

#### 🦟 PLAGA

##### Crear Plaga
```json
{
  "event": "createPlaga",
  "data": {
    "nombre": "Gorgojo",
    "tipo": "Insecto",
    "regionAfectada": "Costa",
    "nivelRiesgo": "Alto"
  }
}
```
##### Listar Plagas
```json
{ "event": "listPlaga" }
```
##### Actualizar Plaga
```json
{
  "event": "updatePlaga",
  "data": {
    "id": 1,
    "dto": {
      "nombre": "Gorgojo Rojo",
      "nivelRiesgo": "Medio"
    }
  }
}
```
##### Eliminar Plaga
```json
{ "event": "deletePlaga", "data": 1 }
```

---

#### 📤 DATOAEXPORTAR

##### Crear DatoAExportar
```json
{
  "event": "createDatoAexportar",
  "data": {
    "nombre": "Exportación 2025",
    "descripcion": "Datos para exportar a Europa",
    "fecha": "2025-07-14"
  }
}
```
##### Listar Datos a Exportar
```json
{ "event": "listDatoAexportar" }
```
##### Actualizar DatoAExportar
```json
{
  "event": "updateDatoAexportar",
  "data": {
    "id": 1,
    "dto": {
      "nombre": "Exportación 2026",
      "descripcion": "Datos actualizados"
    }
  }
}
```
##### Eliminar DatoAExportar
```json
{ "event": "deleteDatoAexportar", "data": 1 }
```

---

### 3. Recibir las respuestas

- Cada vez que se realice una operación, el servidor emitirá automáticamente un evento de actualización a **todos los clientes conectados**.
- Verás la respuesta en la pestaña de mensajes de Postman, por ejemplo:
  - `"cultivoCreated"`
  - `"cultivoList"`
  - `"cultivoUpdated"`
  - `"plagaDeleted"`
  - etc.

---

## 🧪 Pruebas automáticas con el archivo `test`

También puedes testear la API WebSocket automáticamente utilizando el archivo `test` ubicado en la raíz del proyecto.  
Este archivo simula un cliente que realiza operaciones CRUD sobre las tres entidades y muestra las respuestas recibidas del servidor en la consola.

### Pasos para usar el archivo de test:

1. Asegúrate de que el servidor esté corriendo (`npm run start:dev`).
2. Ejecuta en otra terminal:
   ```bash
   node test
   ```
3. Observa en la consola cómo se crean, listan, actualizan y eliminan registros en tiempo real.

Esto es útil para verificar el funcionamiento completo del backend sin necesidad de Postman.

---

## 📁 Estructura del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── cultivo/
│   ├── cultivo.module.ts
│   ├── cultivo.service.ts
│   ├── cultivo.gateway.ts
│   ├── dto/
│   │   ├── create-cultivo.dto.ts
│   │   └── update-cultivo.dto.ts
│   └── entities/
│       └── cultivo.entity.ts
├── plaga/
│   ├── plaga.module.ts
│   ├── plaga.service.ts
│   ├── plaga.gateway.ts
│   ├── dto/
│   │   ├── create-plaga.dto.ts
│   │   └── update-plaga.dto.ts
│   └── entities/
│       └── plaga.entity.ts
├── dato-aexportar/
│   ├── dato-aexportar.module.ts
│   ├── dato-aexportar.service.ts
│   ├── dato-aexportar.gateway.ts
│   ├── dto/
│   │   ├── create-dato-aexportar.dto.ts
│   │   └── update-dato-aexportar.dto.ts
│   └── entities/
│       └── dato-aexportar.entity.ts
test
```

---

## 📌 Consideraciones y Buenas Prácticas

- El flujo de datos es:  
  **Cliente** emite un evento → **Gateway** recibe y llama al **Service** → **Service** interactúa con la BD → **Gateway** emite a todos los clientes el evento actualizado.
- La base de datos SQLite (`app.db`) se crea automáticamente.
- Validación en DTOs con `class-validator`.
- Separa tu lógica de negocio en servicios y gateways.
- Puedes reiniciar los datos borrando el archivo de la base de datos si lo deseas.

---

## 👨‍💻 Autor

Michael Intriago  
Práctica #3 — Aplicación para el Servidor Web  
Carrera de Software — Nivel Quinto  
Docente: John Cevallos  
Periodo: 2025-2026 (1)