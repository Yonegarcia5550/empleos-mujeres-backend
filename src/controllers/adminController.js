import User from "../models/User.js";
import Vacante from "../models/Vacante.js";

// Ver todas las empresas
export const obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await User.find({ rol: "empresa" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(empresas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener empresas",
      error: error.message
    });
  }
};

// Aprobar empresa
export const aprobarEmpresa = async (req, res) => {
  try {
    const empresa = await User.findById(req.params.id);

    if (!empresa) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }

    if (empresa.rol !== "empresa") {
      return res.status(400).json({ mensaje: "El usuario no es una empresa" });
    }

    empresa.estadoEmpresa = "aprobada";
    await empresa.save();

    res.json({ mensaje: "Empresa aprobada correctamente", empresa });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al aprobar empresa",
      error: error.message
    });
  }
};

// Rechazar empresa
export const rechazarEmpresa = async (req, res) => {
  try {
    const empresa = await User.findById(req.params.id);

    if (!empresa) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }

    if (empresa.rol !== "empresa") {
      return res.status(400).json({ mensaje: "El usuario no es una empresa" });
    }

    empresa.estadoEmpresa = "rechazada";
    await empresa.save();

    res.json({ mensaje: "Empresa rechazada correctamente", empresa });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al rechazar empresa",
      error: error.message
    });
  }
};

// Ver todas las vacantes
export const obtenerTodasLasVacantes = async (req, res) => {
  try {
    const vacantes = await Vacante.find()
      .populate("empresa", "nombre correo")
      .sort({ createdAt: -1 });

    res.json(vacantes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener vacantes",
      error: error.message
    });
  }
};

// Eliminar cualquier vacante
export const eliminarVacanteAdmin = async (req, res) => {
  try {
    const vacante = await Vacante.findById(req.params.id);

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

    await vacante.deleteOne();

    res.json({ mensaje: "Vacante eliminada por superusuario" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar vacante",
      error: error.message
    });
  }
};