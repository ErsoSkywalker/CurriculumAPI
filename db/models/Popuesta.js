const { Schema, model } = require("mongoose");

const PropuestaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    puesto: {
      type: String,
      required: true,
      trim: true,
    },
    enfoque: [
      {
        carrera: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    empresa: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    reclutador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reclutador",
      required: true,
    },
    postulantes: [
      {
        usuario: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuario",
        },
        fechaPostulacion: {
          type: Date,
          default: Date.now(),
          required: true,
        },
        estado: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Propuesta", PropuestaSchema);
