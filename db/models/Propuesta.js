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
    carreras: [{ type: String, required: true, trim: true }],
    sueldo: {
      type: Number,
      required: true,
      trim: true,
    },
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
      type: Schema.Types.ObjectId,
      ref: "reclutador",
      required: true,
    },
    postulantes: [
      {
        idUsuario: {
          type: Schema.Types.ObjectId,
          ref: "usuario",
        },
        fechaPostulacion: {
          type: Date,
          default: Date.now(),
          required: true,
        },
        estado: {
          type: String,
          default: "PENDIENTE",
          required: true,
          trim: true,
        },
      },
    ],
    estado: {
      type: String,
      default: "ABIERTA",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Propuesta", PropuestaSchema);
