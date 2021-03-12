const cursos = [{ titulo: "Hola Mundo" }, { titulo: "Adios Mundo" }];

const resolvers = {
  Query: {
    obtenerCursos: (_, { input }, ctx) => {
      const resultado = cursos.filter((curso) => curso.titulo == input.titulo);
      console.log(ctx.miContext);
      return resultado;
    },
  },
};

module.exports = resolvers;
