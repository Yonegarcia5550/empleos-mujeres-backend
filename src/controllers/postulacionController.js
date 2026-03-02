import Postulacion from "../models/Postulacion.js";

// POSTULAR A VACANTE
export const postularVacante = async (req, res) => {
  try {
    if (req.usuario.rol !== "buscadora") {
      return res.status(403).json({
        mensaje: "Solo las buscadoras pueden postularse",
      });
    }

    const { vacanteId } = req.body;

    const nuevaPostulacion = await Postulacion.create({
      vacante: vacanteId,
      usuaria: req.usuario.id,
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

// VER MIS POSTULACIONES
export const misPostulaciones = async (req, res) => {
  try {
    if (req.usuario.rol !== "buscadora") {
      return res.status(403).json({
        mensaje: "No tienes permisos para esta acción",
      });
    }

    const postulaciones = await Postulacion.find({
      usuaria: req.usuario.id,
    }).populate("vacante");

    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener postulaciones",
    });
  }
};
