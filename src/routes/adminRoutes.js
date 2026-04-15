import express from "express";
import {
  obtenerEmpresas,
  aprobarEmpresa,
  rechazarEmpresa,
  obtenerTodasLasVacantes,
  eliminarVacanteAdmin
} from "../controllers/adminController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarSuperusuario } from "../middlewares/verificarSuperusuario.js";

const router = express.Router();

router.get("/empresas", verificarToken, verificarSuperusuario, obtenerEmpresas);
router.put("/empresas/:id/aprobar", verificarToken, verificarSuperusuario, aprobarEmpresa);
router.put("/empresas/:id/rechazar", verificarToken, verificarSuperusuario, rechazarEmpresa);

router.get("/vacantes", verificarToken, verificarSuperusuario, obtenerTodasLasVacantes);
router.delete("/vacantes/:id", verificarToken, verificarSuperusuario, eliminarVacanteAdmin);

export default router;