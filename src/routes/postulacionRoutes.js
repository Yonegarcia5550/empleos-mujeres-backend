import { Router } from "express";
import {
  postularVacante,
  misPostulaciones,
} from "../controllers/postulacionController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verificarToken, postularVacante);
router.get("/mias", verificarToken, misPostulaciones);

export default router;
