const { io } = require("socket.io-client");

// Cambia el puerto si es necesario
const socket = io("http://localhost:3000", { transports: ["websocket"] });

function logSeparator() {
  console.log("--------------------------------------------------");
}

socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket, id:", socket.id);
  logSeparator();

  // CULTIVO
  socket.emit("createCultivo", {
    nombre: "Trigo",
    tipo: "Cereal",
    temporada: "Invierno",
    region: "Andalucía"
  });

  socket.emit("listCultivo");

  // PLAGA
  socket.emit("createPlaga", {
    nombre: "Gorgojo",
    tipo: "Insecto",
    regionAfectada: "Costa",
    nivelRiesgo: "Alto"
  });

  socket.emit("listPlaga");

  // DATOAEXPORTAR (modifica los campos según tu entidad)
  socket.emit("createDatoAexportar", {
    nombre: "Exportación 2025",
    descripcion: "Datos para exportar a Europa",
    fecha: "2025-07-14"
  });

  socket.emit("listDatoAexportar");

  // Puedes descomentar para probar update y delete después de crear
  // socket.emit("updateCultivo", { id: 1, dto: { nombre: "Trigo Mejorado" } });
  // socket.emit("deleteCultivo", 1);
  // socket.emit("updatePlaga", { id: 1, dto: { nivelRiesgo: "Moderado" } });
  // socket.emit("deletePlaga", 1);
  // socket.emit("updateDatoAexportar", { id: 1, dto: { descripcion: "Actualizado" } });
  // socket.emit("deleteDatoAexportar", 1);
});

// CULTIVO events
socket.on("cultivoCreated", (data) => {
  console.log("Cultivo creado, lista:", data);
  logSeparator();
});
socket.on("cultivoList", (data) => {
  console.log("Lista de cultivos:", data);
  logSeparator();
});
socket.on("cultivoUpdated", (data) => {
  console.log("Cultivo actualizado, lista:", data);
  logSeparator();
});
socket.on("cultivoDeleted", (data) => {
  console.log("Cultivo eliminado, lista:", data);
  logSeparator();
});

// PLAGA events
socket.on("plagaCreated", (data) => {
  console.log("Plaga creada, lista:", data);
  logSeparator();
});
socket.on("plagaList", (data) => {
  console.log("Lista de plagas:", data);
  logSeparator();
});
socket.on("plagaUpdated", (data) => {
  console.log("Plaga actualizada, lista:", data);
  logSeparator();
});
socket.on("plagaDeleted", (data) => {
  console.log("Plaga eliminada, lista:", data);
  logSeparator();
});

// DATOAEXPORTAR events
socket.on("datoAexportarCreated", (data) => {
  console.log("DatoAexportar creado, lista:", data);
  logSeparator();
});
socket.on("datoAexportarList", (data) => {
  console.log("Lista de datos a exportar:", data);
  logSeparator();
});
socket.on("datoAexportarUpdated", (data) => {
  console.log("DatoAexportar actualizado, lista:", data);
  logSeparator();
});
socket.on("datoAexportarDeleted", (data) => {
  console.log("DatoAexportar eliminado, lista:", data);
  logSeparator();
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión:", err.message);
  logSeparator();
});