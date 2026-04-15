import mongoose from "mongoose";

const vacanteSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: String,
    },
    salario: {
      type: Number,
    },
    tipo: {
      type: String,
      enum: ["tiempo completo", "medio tiempo"],
      default: "tiempo completo",
    },
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postulantes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    telefono: {
      type: String,
      required: false
    },
    direccionCompleta: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vacante", vacanteSchema);