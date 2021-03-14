const Usuario = require("./models/Usuarios");
const Reclutador = require("./models/Reclutador");
const jwt = require("jsonwebtoken");
const crearToken = (usuario, secreta, expiresIn) => {
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, {
    expiresIn,
  });
};

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const userInfo = await jwt.verify(token, process.env.SECRET);
      return userInfo;
    },
    obtenerContactoUsuario: async (_, {}, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      return existeUsuario.contacto;
    },
    obtenerTrayectoriaAcademicaUsuario: async (_, {}, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      return existeUsuario.trayectoriaAcademica;
    },
    obtenerTrayectoriaLaboralUsuario: async (_, {}, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      return existeUsuario.trayectoriaLaboral;
    },
    obtenerSkillsUsuario: async (_, {}, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      return existeUsuario.skills;
    },
    obtenerReclutador: async (_, { token }) => {
      const reclutadorInfo = await jwt.verify(token, process.env.SECRET);
      return reclutadorInfo;
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
    agregarContactoUsuario: async (_, { input }, ctx) => {
      const contactoInput = input.contact;
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      let existeContacto = false;
      for await (const contacto of existeUsuario.contacto) {
        if (contacto.contact == contactoInput) {
          existeContacto = true;
        }
      }
      if (existeContacto) {
        throw new Error("El contacto ya existe");
      }
      existeUsuario.contacto.push(input);
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.contacto;
    },
    agregarTrayectoriaAcademica: async (_, { input }, ctx) => {
      const escuelaInput = input.escuela;
      const nivelInput = input.nivel;
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      let existeEscuela = false;
      for await (const trayectoria of existeUsuario.trayectoriaAcademica) {
        if (
          trayectoria.escuela == escuelaInput &&
          trayectoria.nivel == nivelInput
        ) {
          existeEscuela = true;
        }
      }
      if (existeEscuela) {
        throw new Error("La ecombinación de escuela y nivel ya existe");
      }
      existeUsuario.trayectoriaAcademica.push(input);
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.trayectoriaAcademica;
    },
    agregarTrayectoriaLaboral: async (_, { input }, ctx) => {
      const empresaInput = input.empresa;
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      let existeEmpresa = false;
      for await (const trayectoria of existeUsuario.trayectoriaLaboral) {
        if (trayectoria.empresa == empresaInput) {
          existeEmpresa = true;
        }
      }
      if (existeEmpresa) {
        throw new Error("El trabajo ya existe");
      }
      if (!input.egreso) {
        input.permaneceTrabajando = true;
      } else {
        input.permaneceTrabajando = false;
      }
      existeUsuario.trayectoriaLaboral.push(input);
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.trayectoriaLaboral;
    },
    agregarSkills: async (_, { input }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      let existeSkill = false;
      for await (const skill of existeUsuario.skills) {
        if (skill == input) {
          existeSkill = true;
        }
      }
      if (existeSkill) {
        throw new Error("Esa skill ya existe");
      }
      existeUsuario.skills.push(input);
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.skills;
    },
    eliminarContactoUsuario: async (_, { input }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      for (let i = 0; i < existeUsuario.contacto.length; i++) {
        if (existeUsuario.contacto[i]._id == input) {
          existeUsuario.contacto.splice(i, 1);
        }
      }
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.contacto;
    },
    eliminarTrayectoriaAcademicaUsuario: async (_, { input }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      for (let i = 0; i < existeUsuario.trayectoriaAcademica.length; i++) {
        if (existeUsuario.trayectoriaAcademica[i]._id == input) {
          existeUsuario.trayectoriaAcademica.splice(i, 1);
        }
      }
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.trayectoriaAcademica;
    },
    eliminarTrayectoriaLaboralUsuario: async (_, { input }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      for (let i = 0; i < existeUsuario.trayectoriaLaboral.length; i++) {
        if (existeUsuario.trayectoriaLaboral[i]._id == input) {
          existeUsuario.trayectoriaLaboral.splice(i, 1);
        }
      }
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.trayectoriaLaboral;
    },
    eliminarSkillUsuario: async (_, { input }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      for (let i = 0; i < existeUsuario.skills.length; i++) {
        if (existeUsuario.skills[i] == input) {
          existeUsuario.skills.splice(i, 1);
        }
      }
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.skills;
    },
    agregarFechaDeEgresoAcademica: async (_, { input, fecha }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      for (let i = 0; i < existeUsuario.trayectoriaAcademica.length; i++) {
        if (existeUsuario.trayectoriaAcademica[i]._id == input) {
          existeUsuario.trayectoriaAcademica[i].egreso = fecha;
        }
      }
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.trayectoriaAcademica;
    },
    agregarFechaDeEgresoLaboral: async (_, { input, fecha }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }
      for (let i = 0; i < existeUsuario.trayectoriaLaboral.length; i++) {
        if (existeUsuario.trayectoriaLaboral[i]._id == input) {
          existeUsuario.trayectoriaLaboral[i].egreso = fecha;
          existeUsuario.trayectoriaLaboral[i].permaneceTrabajando = false;
        }
      }
      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.trayectoriaLaboral;
    },
    cambiarPromedioUsuario: async (_, { promedio }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }

      existeUsuario.academico.promedio = promedio;

      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado.academico;
    },
    cambiarEstadoUsuario: async (_, { estado }, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }

      existeUsuario.estado = estado;

      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado;
    },
    completarPracticasProfesionales: async (_, {}, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }

      existeUsuario.practicasProfesionales = true;

      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado;
    },
    completarServicioSocial: async (_, {}, ctx) => {
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }

      existeUsuario.servicioSocial = true;

      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );
      return resultado;
    },
    editarUsuario: async (_, { input }, ctx) => {
      const { nombre, apellido, email, password, passwordAntigua } = input;
      const existeUsuario = await Usuario.findById(ctx.user.id);
      if (!existeUsuario) {
        throw new Error("Tu usuario no existe");
      }

      const passwordCorrecto = await existeUsuario.matchPassword(
        passwordAntigua,
        existeUsuario.password
      );

      if (!passwordCorrecto) {
        throw new Error("Combinación incorrecta");
      }

      existeUsuario.nombre = nombre;
      existeUsuario.apellido = apellido;
      existeUsuario.email = email;
      existeUsuario.password = await existeUsuario.encryptPassword(password);

      const resultado = await Usuario.findOneAndUpdate(
        { _id: ctx.user.id },
        existeUsuario,
        { new: true }
      );

      return {
        token: crearToken(resultado, process.env.SECRET, "24h"),
      };
    },
    nuevoReclutador: async (_, { input }) => {
      const { email, password } = input;
      const existeReclutador = await Reclutador.findOne({ email });
      if (existeReclutador) {
        throw new Error("Este reclutador ya está registrado");
      }

      try {
        const reclutadorGo = {
          nombre: input.nombre,
          apellido: input.apellido,
          email: input.email,
          password: input.password,
          empresa: input.empresa,
          contacto: [],
          busquedas: [],
          intereses: [],
        };

        const newReclutador = await Reclutador(reclutadorGo);
        newReclutador.password = await newReclutador.encryptPassword(
          newReclutador.password
        );
        newReclutador.save();
        return newReclutador;
      } catch (error) {
        console.log(error);
      }
    },
    autenticarReclutador: async (_, { input }) => {
      const { email, password } = input;
      const existeReclutador = await Reclutador.findOne({ email });
      if (!existeReclutador) {
        throw new Error("El reclutador no existe");
      }

      const passwordCorrecto = await existeReclutador.matchPassword(
        password,
        existeReclutador.password
      );

      if (!passwordCorrecto) {
        throw new Error("Combinación incorrecta");
      }

      return {
        token: crearToken(existeReclutador, process.env.SECRET, "24h"),
      };
    },
    agregarInteresReclutador: async (_, { input }, ctx) => {
      const existeReclutador = await Reclutador.findById(ctx.user.id);
      if (!existeReclutador) {
        throw new Error("Ese reclutador no existe");
      }

      let existeInteres = false;
      for await (const Interes of existeReclutador.intereses) {
        if (Interes == input) {
          existeInteres = true;
        }
      }

      if (existeInteres) {
        throw new Error("Ese interés ya existe");
      }

      existeReclutador.intereses.push(input);

      const resultado = await Reclutador.findOneAndUpdate(
        { _id: ctx.user.id },
        existeReclutador,
        { new: true }
      );

      return resultado.intereses;
    },
    eliminarInteresReclutador: async (_, { input }, ctx) => {
      const existeReclutador = await Reclutador.findById(ctx.user.id);
      if (!existeReclutador) {
        throw new Error("Ese reclutador no existe");
      }
      for (let i = 0; i < existeReclutador.intereses.length; i++) {
        if (existeReclutador.intereses[i] == input) {
          existeReclutador.intereses.splice(i, 1);
        }
      }

      const resultado = await Reclutador.findOneAndUpdate(
        { _id: ctx.user.id },
        existeReclutador,
        { new: true }
      );

      return resultado.intereses;
    },
    crearContactoReclutador: async (_, { input }, ctx) => {
      const existeReclutador = await Reclutador.findById(ctx.user.id);
      if (!existeReclutador) {
        throw new Error("Ese reclutador no existe");
      }

      let existeContacto = false;
      for await (const contacto of existeReclutador.contacto) {
        if (contacto.contact == input.contact) {
          existeContacto = true;
        }
      }

      if (existeContacto) {
        throw new Error("Ese contacto ya existe");
      }

      existeReclutador.contacto.push(input);

      const resultado = await Reclutador.findOneAndUpdate(
        { _id: ctx.user.id },
        existeReclutador,
        { new: true }
      );

      return resultado.contacto;
    },
    eliminarContactoReclutador: async (_, { id }, ctx) => {
      const existeReclutador = await Reclutador.findById(ctx.user.id);
      if (!existeReclutador) {
        throw new Error("Ese reclutador no existe");
      }

      for (let i = 0; i < existeReclutador.contacto.length; i++) {
        if (existeReclutador.contacto[i]._id == id) {
          existeReclutador.contacto.splice(i, 1);
        }
      }

      const resultado = await Reclutador.findOneAndUpdate(
        { _id: ctx.user.id },
        existeReclutador,
        { new: true }
      );

      return resultado.contacto;
    },
  },
};

module.exports = resolvers;
