import express from "express";
import {
  crearVacante,
  listarVacantes,
  obtenerVacantes,
  obtenerVacante,
  eliminarVacante,
  postularVacante,
  verPostulantes,
  buscarPorColonia,
  actualizarVacante
} from "../controllers/vacanteController.js";

const router = express.Router();

// 📌 LISTAR TODAS
router.get("/", obtenerVacantes);

// 📌 O listarVacantes (elige uno)
// router.get("/", listarVacantes);

// 📌 OBTENER POR ID
router.get("/:id", obtenerVacante);

// 📌 CREAR
router.post("/", crearVacante);

// 📌 ELIMINAR
router.delete("/:id", eliminarVacante);

// 📌 POSTULAR
router.post("/:id/postular", postularVacante);

// 📌 VER POSTULANTES
router.get("/:id/postulantes", verPostulantes);
// buscar por colonia 
router.get("/buscar/colonia", buscarPorColonia);
//actualizar vacante
router.put("/vacantes/:id", actualizarVacante);

export default router;
