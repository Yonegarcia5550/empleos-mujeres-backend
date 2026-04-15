import { Router } from "express";
import {
  postularVacante,
  misPostulaciones,
  postulacionesPorVacanteEmpresa,
  actualizarEstadoPostulacion,
} from "../controllers/postulacionController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verificarToken, postularVacante);
router.get("/mias", verificarToken, misPostulaciones);

// empresa
router.get("/vacante/:vacanteId", verificarToken, postulacionesPorVacanteEmpresa);
router.put("/:id/estado", verificarToken, actualizarEstadoPostulacion);

export default router;