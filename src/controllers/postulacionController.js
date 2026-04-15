import Postulacion from "../models/Postulacion.js";
import Vacante from "../models/Vacante.js";

export const postularVacante = async (req, res) => {
  try {
    if (req.usuario.rol !== "buscadora") {
      return res.status(403).json({
        mensaje: "Solo las buscadoras pueden postularse",
      });
    }

    const { vacanteId, nombre, correo, telefono, experiencia, mensaje } = req.body;

    if (!vacanteId || !nombre || !correo || !telefono) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios",
      });
    }

    const existente = await Postulacion.findOne({
      vacante: vacanteId,
      usuaria: req.usuario.id,
    });

    if (existente) {
      return res.status(400).json({
        mensaje: "Ya te postulaste a esta vacante",
      });
    }

    const nuevaPostulacion = await Postulacion.create({
      vacante: vacanteId,
      usuaria: req.usuario.id,
      nombre,
      correo,
      telefono,
      experiencia,
      mensaje,
      estado: "enviada",
    });

    res.status(201).json({
      mensaje: "Postulación enviada ✅",
      postulacion: nuevaPostulacion,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al postular",
      error: error.message,
    });
  }
};

export const misPostulaciones = async (req, res) => {
  try {
    console.log("REQ.USUARIO:", req.usuario);

    if (req.usuario.rol !== "buscadora") {
      return res.status(403).json({
        mensaje: "No tienes permisos para esta acción",
      });
    }

    const postulaciones = await Postulacion.find({
      usuaria: req.usuario.id,
    })
      .populate("vacante")
      .sort({ createdAt: -1 });

    console.log("POSTULACIONES ENCONTRADAS:", postulaciones);

    res.json(postulaciones);
  } catch (error) {
    console.log("ERROR MIS POSTULACIONES:", error);
    res.status(500).json({
      mensaje: "Error al obtener postulaciones",
      error: error.message,
    });
  }
};
export const postulacionesPorVacanteEmpresa = async (req, res) => {
  try {
    if (req.usuario.rol !== "empresa") {
      return res.status(403).json({
        mensaje: "Solo las empresas pueden ver estas postulaciones",
      });
    }

    const { vacanteId } = req.params;

    const vacante = await Vacante.findById(vacanteId);

    if (!vacante) {
      return res.status(404).json({
        mensaje: "Vacante no encontrada",
      });
    }

    if (vacante.empresa.toString() !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No tienes permiso para ver estas postulaciones",
      });
    }

    const postulaciones = await Postulacion.find({ vacante: vacanteId })
      .sort({ createdAt: -1 });

    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener postulaciones de la vacante",
      error: error.message,
    });
  }
};

export const actualizarEstadoPostulacion = async (req, res) => {
  try {
    if (req.usuario.rol !== "empresa") {
      return res.status(403).json({
        mensaje: "Solo las empresas pueden actualizar postulaciones",
      });
    }

    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["enviada", "revisada", "aceptada", "rechazada"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado inválido",
      });
    }

    const postulacion = await Postulacion.findById(id).populate("vacante");

    if (!postulacion) {
      return res.status(404).json({
        mensaje: "Postulación no encontrada",
      });
    }

    if (!postulacion.vacante) {
      return res.status(404).json({
        mensaje: "La vacante asociada no existe",
      });
    }

    if (postulacion.vacante.empresa.toString() !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No tienes permiso para modificar esta postulación",
      });
    }

    postulacion.estado = estado;
    await postulacion.save();

    res.json({
      mensaje: "Estado actualizado correctamente",
      postulacion,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar estado",
      error: error.message,
    });
  }
};