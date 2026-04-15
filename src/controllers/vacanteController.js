import Vacante from "../models/Vacante.js";

// Crear vacante (empresa)
export const crearVacante = async (req, res) => {
  const { lat, lng } = req.body;

  if (req.usuario.rol !== "empresa") {
    return res.status(403).json({ mensaje: "Solo las empresas pueden crear vacantes" });
  }

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ mensaje: "Faltan coordenadas (lat, lng)" });
  }

  try {
    if (req.body.tipo) {
      req.body.tipo = req.body.tipo.toLowerCase().trim();
    }

    const vacante = new Vacante({
      ...req.body,
      empresa: req.usuario.id
    });

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
    if (req.usuario.rol !== "buscadora") {
      return res.status(403).json({ mensaje: "Solo las buscadoras pueden postularse" });
    }

    const vacante = await Vacante.findById(req.params.id);

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

    const yaPostulada = Array.isArray(vacante.postulantes) &&
      vacante.postulantes.some(
        (id) => id.toString() === req.usuario.id.toString()
      );

    if (yaPostulada) {
      return res.status(400).json({ mensaje: "Ya estás postulada" });
    }

    await Vacante.updateOne(
      { _id: req.params.id },
      { $addToSet: { postulantes: req.usuario.id } }
    );

    res.json({ mensaje: "Postulación exitosa 💜" });
  } catch (error) {
    console.error("Error real al postular:", error);
    res.status(500).json({
      mensaje: "Error al postular",
      error: error.message
    });
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
    if (req.usuario.rol !== "empresa") {
      return res.status(403).json({ mensaje: "Solo las empresas pueden eliminar vacantes" });
    }

    const vacante = await Vacante.findById(req.params.id);

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

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
    if (req.usuario.rol !== "empresa") {
      return res.status(403).json({
        mensaje: "Solo las empresas pueden actualizar vacantes"
      });
    }

    const { id } = req.params;
    const vacante = await Vacante.findById(id);

    if (!vacante) {
      return res.status(404).json({ mensaje: "Vacante no encontrada" });
    }

    if (vacante.empresa.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const {
      titulo,
      descripcion,
      ubicacion,
      salario,
      tipo,
      lat,
      lng,
      telefono,
      direccionCompleta
    } = req.body;

    vacante.titulo = titulo ?? vacante.titulo;
    vacante.descripcion = descripcion ?? vacante.descripcion;
    vacante.ubicacion = ubicacion ?? vacante.ubicacion;
    vacante.salario = salario ?? vacante.salario;
    vacante.tipo = tipo ? tipo.toLowerCase().trim() : vacante.tipo;
    vacante.lat = lat ?? vacante.lat;
    vacante.lng = lng ?? vacante.lng;
    vacante.telefono = telefono ?? vacante.telefono;
    vacante.direccionCompleta = direccionCompleta ?? vacante.direccionCompleta;

    await vacante.save();

    res.json(vacante);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar vacante",
      error: error.message
    });
  }
};
export const misVacantes = async (req, res) => {
  try {
    if (req.usuario.rol !== "empresa") {
      return res.status(403).json({ mensaje: "Solo las empresas pueden ver sus vacantes" });
    }

    const vacantes = await Vacante.find({ empresa: req.usuario.id }).sort({ createdAt: -1 });
    res.json(vacantes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vacantes de la empresa" });
  }
};

