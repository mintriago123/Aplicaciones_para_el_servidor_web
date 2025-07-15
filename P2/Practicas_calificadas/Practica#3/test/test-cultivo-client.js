const { io } = require("socket.io-client");

// Cambia la URL si tu servidor usa otro puerto
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Fuerza WebSocket puro
});

socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket, id:", socket.id);

  // Prueba: crear un cultivo
  socket.emit("createCultivo", {
    nombre: "Trigo",
    tipo: "Cereal",
    temporada: "Invierno",
    region: "Andalucía"
  });

  // Prueba: listar cultivos
  socket.emit("listCultivo");
});

socket.on("cultivoCreated", (data) => {
  console.log("Cultivo creado, lista actualizada:", data);
});

socket.on("cultivoList", (data) => {
  console.log("Lista de cultivos:", data);
});

socket.on("cultivoUpdated", (data) => {
  console.log("Cultivo actualizado, lista:", data);
});

socket.on("cultivoDeleted", (data) => {
  console.log("Cultivo eliminado, lista:", data);
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión:", err.message);
});