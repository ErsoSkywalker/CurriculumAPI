const { gql } = require("apollo-server");

const typeDefs = gql`
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

  type TrayectoriaAcademicaUsuario {
    id: ID
    escuela: String
    ingreso: String
    egreso: String
    nivel String
  }

  type ExperienciaLaboral{
    empresa: String
    ingreso: String
    egreso: String
    puesto: String
    descripcionActividades: String
    permaneceTrabajando: Boolean
  }

  type TrayectoriaLaboralUsuario{
    id: ID
    detalles: ExperienciaLaboral
  }

  type QueryUsuario:{
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

  input CursoInput {
    titulo: String!
  }
  #Query
  type Query {
    obtenerCursos(input: CursoInput!): [Curso]
  }
`;

module.exports = typeDefs;
