import mongoose from "mongoose";

const obraSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    autor: {
      type: String,
      required: true,
      trim: true,
    },
    año: {
      type: Number,
      required: true,
    },
    siglo: {
      type: String,
      required: true,
      uppercase: true,
      match: /^[IVXLCDM]+$/, // acepta solo números romanos
    },
    corriente: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    continente: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      required: true, // será URL de Cloudinary
    },
    aprobada: {
      type: Boolean,
      default: false,
    },
    subidaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favoritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Obra = mongoose.model("Obra", obraSchema);
export default Obra;