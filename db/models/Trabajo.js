const { Schema, model } = require("mongoose");

const TrabajoSchema = new Schema(
  {
    puesto: {
      type: String,
      required: true,
      trim: true,
    },
    desde: {
      type: Date,
      required: true,
    },
    hasta: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Trabajo", TrabajoSchema);
