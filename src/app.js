import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vacanteRoutes from "./routes/VacanteRoutes.js";
import { verificarToken } from "./middlewares/authMiddleware.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();


// ✅ MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());

// ✅ RUTAS
app.use("/auth", authRoutes);
app.use("/vacantes", vacanteRoutes);
app.use("/admin", adminRoutes);

// Ruta pública de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API con MongoDB conectada 🚀",
  });
});

app.use("/postulaciones", postulacionRoutes);

// Ruta protegida de prueba
app.get("/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso autorizado 🔐",
    usuario: req.usuario,
  });
});

export default app;
