import Vacante from "../models/Vacante.js";

// Crear vacante (empresa)
export const crearVacante = async (req, res) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
  return res.status(400).json({ mensaje: "Faltan coordenadas (lat, lng)" });
  }

  try {
    if (req.body.tipo) {
      req.body.tipo = req.body.tipo.toLowerCase().trim();
    }

    const vacante = new Vacante(req.body);
    await vacante.save();

    res.status(201).json(vacante);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear vacante",
      error: error.message,
    });
  }
};

//listar vacantes


export const listarVacantes = async (req, res) => {
  try {
    const vacantes = await Vacante.find();
    res.json(vacantes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vacantes" });
  }
};



// Obtener todas las vacantes (público)
export const obtenerVacantes = async (req, res) => {
  try {
    const vacantes = await Vacante.find().populate(
      "empresa",
      "nombre correo"
    );

    res.json(vacantes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener vacantes",
      error: error.message,
    });
  }
};

// obtener con Id
export const obtenerVacante = async (req, res) => {
  try {
    const vacante = await Vacante.findById(req.params.id)
      .populate("empresa", "nombre correo");

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

    res.json(vacante);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vacante" });
  }
};



export const postularVacante = async (req, res) => {
  try {
    const vacante = await Vacante.findById(req.params.id);

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

    if (vacante.postulantes.includes(req.usuario.id)) {
      return res.status(400).json({ mensaje: "Ya estás postulada" });
    }

    vacante.postulantes.push(req.usuario.id);
    await vacante.save();

    res.json({ mensaje: "Postulación exitosa 💜" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al postular" });
  }
};


// ver postulaciones solo empresa duena
export const verPostulantes = async (req, res) => {
  try {
    const vacante = await Vacante.findById(req.params.id)
      .populate("postulantes", "nombre correo");

    if (!vacante) {
      return res.status(404).json({
        mensaje: "Vacante no encontrada",
      });
    }

    //  PASO 5: validar que la vacante sea de la empresa
    if (vacante.empresa.toString() !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No tienes permisos para ver esta vacante",
      });
    }

    res.json(vacante.postulantes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener postulantes",
    });
  }
};

export const buscarPorColonia = async (req, res) => {
  try {

    let { colonia } = req.query;

    if (!colonia) {
      return res.json([]);
    }

    // 🔥 Normalizar texto recibido
    colonia = colonia.toLowerCase().trim();

    const vacantes = await Vacante.find({
      "ubicacion.colonia": {
        $regex: colonia,
        $options: "i"   // ← Case insensitive
      }
    }).populate("empresa", "nombre correo");

    res.json(vacantes);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error en búsqueda",
      error: error.message
    });
  }
};


// eliminar vacante
export const eliminarVacante = async (req, res) => {
  try {
    const vacante = await Vacante.findById(req.params.id);

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

    // 🔐 VALIDACIÓN DE PROPIEDAD
    if (vacante.empresa.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    await vacante.deleteOne();
    res.json({ mensaje: "Vacante eliminada" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar vacante" });
  }
};
export const actualizarVacante = async (req, res) => {
  try {
    const { id } = req.params;

    const vacante = await Vacante.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(vacante);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar vacante",
      error: error.message
    });
  }
};


