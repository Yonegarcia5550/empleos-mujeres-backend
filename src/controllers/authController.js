import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ======================
   REGISTRO
====================== */
/*export const register = async (req, res) => {
  try {
    let { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios",
      });
    }

    correo = correo.toLowerCase();

    const existeUsuario = await User.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({
        msg: "El correo ya está registrado",
      });
    }

    // ✅ Validar rol
    if (!rol) {
      rol = "buscadora";
    }

    if (!["buscadora", "empresa"].includes(rol)) {
      return res.status(400).json({
        msg: "Rol inválido",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuario = await User.create({
      nombre,
      correo,
      password: passwordHash,
      rol,
    });

    res.status(201).json({
      msg: "Usuario registrado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};*/

/* ======================
   LOGIN
====================== */
/*export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no existe" });
    }

    const passwordCorrecto = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecto) {
      return res.status(401).json({ msg: "Password incorrecto" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      msg: "Login correcto",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });*/
    export const login = (req, res) => {
  const { correo, password } = req.body;

  if (correo === "test@correo.com" && password === "123456") {
    return res.json({ token: "token-prueba" });
  }

  res.status(401).json({ msg: "Credenciales incorrectas" });
};

export const register = (req, res) => {
  res.json({ msg: "Registro ok" });
};
