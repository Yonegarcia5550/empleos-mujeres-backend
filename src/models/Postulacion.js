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
    estado: {
      type: String,
      enum: ["enviada", "revisada", "aceptada", "rechazada"],
      default: "enviada",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Postulacion", postulacionSchema);
