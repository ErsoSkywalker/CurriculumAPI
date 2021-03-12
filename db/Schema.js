const { gql } = require("apollo-server");

const typeDefs = gql`
  type Curso {
    titulo: String
  }

  input CursoInput {
    titulo: String!
  }

  type Query {
    obtenerCursos(input: CursoInput!): [Curso]
  }
`;

module.exports = typeDefs;
