import express from "express";
import { DatosAExportarRepositoryImpl } from "../../../infrastructure/orm/repositories/DatosAExportarRepositoryImpl";
import { CreateDato } from "../../../application/use-cases/datosExportar/CreateDato";
import { GetAllDatos } from "../../../application/use-cases/datosExportar/GetAllDatos";

const router = express.Router();
const repo = new DatosAExportarRepositoryImpl();

router.post("/", async (req, res) => {
  const useCase = new CreateDato(repo);
  const result = await useCase.execute(req.body);
  res.status(201).json(result);
});

router.get("/", async (_req, res) => {
  const useCase = new GetAllDatos(repo);
  const result = await useCase.execute();
  res.json(result);
});

export default router;
