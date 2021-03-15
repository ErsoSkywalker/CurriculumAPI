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

  enum enumContactMethod {
    TELEFONO
    MAIL
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
    contactMethod: enumContactMethod
  }

  input InputContactoUsuario {
    contact: String!
    contactMethod: enumContactMethod!
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
    egreso: String
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

  input InputEditarUsuario {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
    passwordAntigua: String!
  }

  input InputUsuario {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
    numeroDeBoleta: Int!
    estado: EstadoEnum!
    promedio: Float!
    carrera: String!
    unidadAcademica: String!
    servicioSocial: Boolean!
    practicasProfesionales: Boolean!
  }

  #Reclutador

  type ReclutadorContacto {
    id: ID
    contact: String
    contactMethod: enumContactMethod
  }

  type Reclutador {
    id: ID
    nombre: String
    apellido: String
    email: String
    empresa: String
    contacto: [ReclutadorContacto]
    intereses: [String]
  }

  input ReclutadorInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
    empresa: String!
  }

  input ReclutadorEditarInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
    passwordAntigua: String!
  }

  input AuthReclutador {
    email: String!
    password: String!
  }

  input ReclutadorContactoInput {
    contact: String!
    contactMethod: enumContactMethod!
  }

  #Propuesta

  enum EstadoPostulacion {
    ACTIVA
    PENDIENTE
    DESCARTADA
  }

  enum EstadoPropuesta {
    ABIERTA
    CERRADA
  }

  type PropuestaPostulante {
    id: ID
    fechaPostulacion: String
    estado: EstadoPostulacion
  }

  type Propuesta {
    id: ID
    titulo: String
    puesto: String
    carreras: [String]
    sueldo: Float!
    empresa: String
    descripcion: String
    reclutador: ID
    postulantes: [PropuestaPostulante]
    estado: EstadoPropuesta
  }

  input PropuestaInput {
    titulo: String!
    puesto: String!
    carreras: [String]!
    sueldo: Float!
    descripcion: String!
  }

  #Query
  type Query {
    #Usuario
    obtenerUsuario(token: String!): Usuario
    obtenerContactoUsuario: [ContactoUsuario]
    obtenerTrayectoriaAcademicaUsuario: [TrayectoriaAcademicaUsuario]
    obtenerTrayectoriaLaboralUsuario: [TrayectoriaLaboralUsuario]
    obtenerSkillsUsuario: [String]
    #Reclutador
    obtenerReclutador(token: String!): Reclutador
  }

  #Mutation
  type Mutation {
    #Usuario
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
    eliminarContactoUsuario(input: ID!): [ContactoUsuario]
    eliminarTrayectoriaAcademicaUsuario(
      input: ID!
    ): [TrayectoriaAcademicaUsuario]
    eliminarTrayectoriaLaboralUsuario(input: ID!): [TrayectoriaLaboralUsuario]
    eliminarSkillUsuario(input: String!): [String]
    agregarFechaDeEgresoAcademica(
      input: ID!
      fecha: String!
    ): [TrayectoriaAcademicaUsuario]
    agregarFechaDeEgresoLaboral(
      input: ID!
      fecha: String!
    ): [TrayectoriaLaboralUsuario]
    cambiarPromedioUsuario(promedio: Float!): AcademicoUsuario
    cambiarEstadoUsuario(estado: EstadoEnum!): Usuario
    completarPracticasProfesionales: Usuario
    completarServicioSocial: Usuario
    editarUsuario(input: InputEditarUsuario!): Token

    #Reclutador
    nuevoReclutador(input: ReclutadorInput!): Reclutador
    autenticarReclutador(input: AuthReclutador!): Token
    agregarInteresReclutador(input: String!): [String]
    eliminarInteresReclutador(input: String!): [String]
    crearContactoReclutador(
      input: ReclutadorContactoInput!
    ): [ReclutadorContacto]
    eliminarContactoReclutador(id: ID!): [ReclutadorContacto]
    editarReclutador(input: ReclutadorEditarInput!): Token

    #Propuesta
    nuevaPropuesta(input: PropuestaInput!): Propuesta
    cambiarEstadoPropuesta(id: ID!): Propuesta
    editarPropuesta(id: ID!, input: PropuestaInput!): Propuesta
    cambiarEstadoPostulante(
      id: ID!
      idPostulante: ID!
      estadoPostulacion: EstadoPostulacion!
    ): Propuesta
    #Estas dos se hacen desde el perfil del usuario
    postularUsuario(id: ID!): String
    retirarCandidatura(id: ID!): String
  }
`;

module.exports = typeDefs;
