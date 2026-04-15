import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["buscadora", "empresa", "superusuario"],
      default: "buscadora",
    },
    estadoEmpresa: {
      type: String,
      enum: ["pendiente", "aprobada", "rechazada"],
      default: "pendiente",
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;