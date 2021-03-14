const Usuario = require("./models/Usuarios");

const resolvers = {
  Query: {
    llenarQuery: () => "Hola",
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
  },
};

module.exports = resolvers;
