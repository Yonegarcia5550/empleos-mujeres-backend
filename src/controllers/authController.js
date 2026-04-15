import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { nombre, correo, telefono, password, rol } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios",
      });
    }

    const correoNormalizado = correo.toLowerCase().trim();

    const existeUsuario = await User.findOne({ correo: correoNormalizado });

    if (existeUsuario) {
      return res.status(400).json({
        mensaje: "Ya existe una cuenta con ese correo",
      });
    }

    const passwordHasheado = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      nombre: nombre.trim(),
      correo: correoNormalizado,
      telefono: telefono?.trim() || "",
      password: passwordHasheado,
      rol: "buscadora",
      estadoEmpresa: "pendiente",
    });

    const token = jwt.sign(
      {
        id: nuevoUsuario._id,
        rol: nuevoUsuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "7d",
      }
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente 💜",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        telefono: nuevoUsuario.telefono,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    const correoNormalizado = correo.toLowerCase().trim();

    const usuario = await User.findOne({ correo: correoNormalizado });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "7d",
      }
    );

    res.json({
      mensaje: "Login exitoso ✅",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
};