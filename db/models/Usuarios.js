const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const experienciaLaboral = new Schema(
  {
    empresa: {
      type: String,
      required: true,
      trim: true,
    },
    ingreso: {
      type: Date,
      required: true,
    },
    egreso: {
      type: Date,
    },
    puesto: {
      type: String,
      required: true,
      trim: true,
    },
    descipcionActividades: {
      type: String,
      required: true,
      trim: true,
    },
    permaneceTrabajando: {
      type: boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UsuarioSchema = new Schema(
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
    numeroDeBoleta: {
      type: Number,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      default: "Regular",
      required: true,
      trim: true,
    },
    academico: {
      promedio: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      carrera: {
        type: String,
        required: true,
        trim: true,
      },
      unidadAcademica: {
        type: String,
        required: true,
        trim: true,
      },
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
    trayectoriaAcademica: [
      {
        escuela: {
          type: String,
          required: true,
          trim: true,
        },
        ingreso: {
          type: Date,
          required: true,
        },
        egreso: {
          type: Date,
        },
        nivel: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    trayectoriaLaboral: [
      {
        detalles: experienciaLaboral,
      },
    ],
    servicioSocial: {
      type: boolean,
      default: false,
    },
    practicasProfesionales: {
      type: boolean,
      default: false,
    },
    busquedas: [
      {
        query: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UsuarioSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("Usuario", UsuarioSchema);
