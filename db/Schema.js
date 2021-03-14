const { gql } = require("apollo-server");

const typeDefs = gql`
  #AuthUsuario
  type Token {
    token: String
  }

  input AuthUsuario {
    email: String!
    password: String!
  }

  #Usuario
  enum EstadoEnum {
    REGULAR
    IRREGULAR
    DESFASE
  }

  type AcademicoUsuario {
    promedio: Float
    carrera: String
    unidadAcademica: String
  }

  type ContactoUsuario {
    id: ID
    contact: String
    contactMethod: String
  }

  input InputContactoUsuario {
    contact: String!
    contactMethod: String!
  }

  type TrayectoriaAcademicaUsuario {
    id: ID
    escuela: String
    ingreso: String
    egreso: String
    nivel: String
  }

  input InputTrayectoriaAcademicaUsuario {
    escuela: String!
    ingreso: String!
    egreso: String!
    nivel: String!
  }

  type TrayectoriaLaboralUsuario {
    id: ID
    empresa: String
    ingreso: String
    egreso: String
    puesto: String
    descripcionActividades: String
    permaneceTrabajando: Boolean
  }

  input InputTrayectoriaLaboralUsuario {
    empresa: String!
    ingreso: String!
    egreso: String
    puesto: String!
    descripcionActividades: String!
  }

  type QueryUsuario {
    id: ID
    query: String
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    password: String
    numeroDeBoleta: Int
    estado: EstadoEnum
    academico: AcademicoUsuario
    contacto: [ContactoUsuario]
    trayectoriaAcademica: [TrayectoriaAcademicaUsuario]
    trayectoriaLaboral: [TrayectoriaLaboralUsuario]
    skills: [String]
    servicioSocial: Boolean
    practicasProfesionales: Boolean
    busquedas: [QueryUsuario]
  }

  input InputUsuario {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
    numeroDeBoleta: Int!
    estado: String!
    promedio: Float!
    carrera: String!
    unidadAcademica: String!
    servicioSocial: Boolean!
    practicasProfesionales: Boolean!
  }

  #Query
  type Query {
    obtenerUsuario(token: String!): Usuario
    obtenerContactoUsuario: [ContactoUsuario]
    obtenerTrayectoriaAcademicaUsuario: [TrayectoriaAcademicaUsuario]
    obtenerTrayectoriaLaboralUsuario: [TrayectoriaLaboralUsuario]
    obtenerSkillsUsuario: [String]
  }

  #Mutation
  type Mutation {
    nuevoUsuario(input: InputUsuario!): Usuario
    autenticarUsuario(input: AuthUsuario!): Token
    agregarContactoUsuario(input: InputContactoUsuario!): [ContactoUsuario]
    agregarTrayectoriaAcademica(
      input: InputTrayectoriaAcademicaUsuario!
    ): [TrayectoriaAcademicaUsuario]
    agregarTrayectoriaLaboral(
      input: InputTrayectoriaLaboralUsuario!
    ): [TrayectoriaLaboralUsuario]
    agregarSkills(input: String!): [String]
  }
`;

module.exports = typeDefs;
