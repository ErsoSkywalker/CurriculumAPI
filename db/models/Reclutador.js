const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const ReclutadorSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    empresa: {
      type: String,
      required: true,
      trim: true,
    },
    contacto: [
      {
        contact: {
          type: String,
          required: true,
          trim: true,
        },
        contactMethod: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    busquedas: [
      {
        query: {
          type: String,
          trim: true,
        },
      },
    ],
    intereses: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ReclutadorSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

ReclutadorSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("Reclutador", ReclutadorSchema);
