const Usuario = require("./models/Usuarios");
const jwt = require("jsonwebtoken");
const crearToken = (usuario, secreta, expiresIn) => {
  const { id, email, nombre, apellido, numeroDeBoleta } = usuario;
  return jwt.sign({ id, email, nombre, apellido, numeroDeBoleta }, secreta, {
    expiresIn,
  });
};

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRET);
      return usuarioId;
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password, numeroDeBoleta } = input;
      const existeUsuario = await Usuario.findOne({ email });
      const existeNumeroBoleta = await Usuario.findOne({ numeroDeBoleta });
      if (existeUsuario || existeNumeroBoleta) {
        throw new Error("El usuario ya está registrado");
      }
      try {
        const userGo = {
          nombre: input.nombre,
          apellido: input.apellido,
          email: input.email,
          password: password,
          numeroDeBoleta: input.numeroDeBoleta,
          estado: input.estado,
          academico: {
            promedio: input.promedio,
            carrera: input.carrera,
            unidadAcademica: "UPIICSA",
          },
          servicioSocial: input.servicioSocial,
          practicasProfesionales: input.practicasProfesionales,
          contacto: [],
          trayectoriaAcademica: [],
          trayectoriaLaboral: [],
          skills: [],
          busquedas: [],
        };
        const newUsuario = new Usuario(userGo);
        newUsuario.password = await newUsuario.encryptPassword(
          newUsuario.password
        );
        newUsuario.save();
        return newUsuario;
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      const passwordCorrecto = await existeUsuario.matchPassword(
        password,
        existeUsuario.password
      );

      if (!passwordCorrecto) {
        throw new Error("Combinación incorrecta");
      }

      return {
        token: crearToken(existeUsuario, process.env.SECRET, "24h"),
      };
    },
  },
};

module.exports = resolvers;
