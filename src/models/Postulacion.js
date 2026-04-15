import mongoose from "mongoose";

const postulacionSchema = new mongoose.Schema(
  {
    vacante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacante",
      required: true,
    },
    usuaria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    experiencia: {
      type: String,
      default: "",
      trim: true,
    },
    mensaje: {
      type: String,
      default: "",
      trim: true,
    },
    estado: {
      type: String,
      enum: ["enviada", "revisada", "aceptada", "rechazada"],
      default: "enviada",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Postulacion", postulacionSchema);