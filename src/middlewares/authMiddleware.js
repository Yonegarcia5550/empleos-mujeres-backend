import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // 🔑 CLAVE
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};
