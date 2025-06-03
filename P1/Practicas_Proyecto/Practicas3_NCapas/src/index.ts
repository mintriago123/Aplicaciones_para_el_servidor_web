import express from "express";
import cors from "cors";
import { AppDataSource } from "./interfaces/database/data-source";
import datosRouter from "./interfaces/http/controllers/DatosExportarController";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/datos", datosRouter);

AppDataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
  });
});
