import express from "express";
import {
  crearVacante,
  obtenerVacantes,
  obtenerVacante,
  eliminarVacante,
  verPostulantes,
  buscarPorColonia,
  actualizarVacante,
  misVacantes,
  postularVacante
} from "../controllers/vacanteController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// rutas específicas primero
router.get("/buscar/colonia", buscarPorColonia);
router.get("/empresa/mias", verificarToken, misVacantes);
router.get("/:id/postulantes", verificarToken, verPostulantes);

// rutas públicas
router.get("/:id", obtenerVacante);
router.get("/", obtenerVacantes);

// postulaciones
router.post("/:id/postular", verificarToken, postularVacante);

// empresa
router.post("/", verificarToken, crearVacante);
router.put("/:id", verificarToken, actualizarVacante);
router.delete("/:id", verificarToken, eliminarVacante);

export default router;