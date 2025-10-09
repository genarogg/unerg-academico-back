const schemas = /* GraphQL */ `

##############################################
# Tipos básicos
##############################################

type Usuario {
  id: Int!
  email: String!
  rol: Rol!
  token: String
  createdAt: Date!
  updatedAt: Date!
  DatosPersonales: [DatosPersonales]
  Bitacora: [Bitacora]
}

type Bitacora {
  id: Int!
  usuarioId: Int!
  accion: String!
  type: AccionesBitacora!
  ip: String!
  hora: Date!
  fecha: Date!
  mensaje: String
}

type DatosPersonales {
  id: Int!
  usuarioId: Int!
  direccionId: Int
  primerNombre: String!
  segundoNombre: String
  tercerNombre: String
  primerApellido: String!
  segundoApellido: String
  sexo: Sex!
  fechaNacimiento: Date!
  numeroCedula: String!
  numeroBancario: String
  telefono: String
  direccion: Direccion
  Expediente: [Expediente]
}

type Direccion {
  id: Int!
  zonaUrbanizacionId: Int!
  calle: String!
  numeroCasa: String!
  zonaUrbanizacion: ZonaUrbanizacion!
}

type ZonaUrbanizacion {
  id: Int!
  estadoPaisId: Int!
  codigoPostal: Int!
  zona: String!
  estadoPais: EstadoPais!
}

type EstadoPais {
  id: Int!
  estado: String!
  vigencia: Boolean!
  createdAt: Date!
  updatedAt: Date!
}

type Expediente {
  id: Int!
  datosPersonalesId: Int!
}

##############################################
# Tipos de respuesta y metadatos
##############################################

type Meta {
  total: Int
  page: Int
  limit: Int
}

type UsuarioResponse {
  type: String
  message: String
  data: Usuario
}

type UsuariosResponse {
  type: String
  message: String
  data: [Usuario]
  meta: Meta
}

type NotificacionResponse {
  type: String
  message: String
}

type EstadoPaisResponse {
  type: String
  message: String
  data: EstadoPais
}

type EstadosPaisResponse {
  type: String
  message: String
  data: [EstadoPais]
}

##############################################
# Tipos de entrada
##############################################

input PDFDataInput {
  data: String!
}


input DireccionInput {
  zonaUrbanizacionId: Int!
  calle: String!
  numeroCasa: String!
}

input ZonaUrbanizacionInput {
  estadoPaisId: Int!
  codigoPostal: Int!
  zona: String!
}

input EstadoPaisInput {
  estado: String!
}

##############################################
# Scalars
##############################################

scalar Upload
scalar Date

##############################################
# Query y Mutation
##############################################

type Query {
  hello: String
  generatePDF(template: String!, data: PDFDataInput!): String  
  validarSesion(token: String!): UsuarioResponse!
  getUsuario(token: String!, filtro: String): UsuariosResponse!

  obtenerEstados(
    token: String!
  ): EstadosPaisResponse!
}

type Mutation {
  registerUsuario(
    email: String!
    password: String!
    cedula: Int!
    captchaToken: String
    token: String
    rol: Rol
  ): UsuarioResponse!

  loginUsuario(
    email: String!, 
    password: String!, 
    captchaToken: String
  ): UsuarioResponse!

  resetPassword(email: String!): NotificacionResponse!

  resetPassWithToken(token: String!, nuevaContrasena: String!): UsuarioResponse!

  crearDatosPersonales( 
    token: String!, 
    primerNombre: String!,
    segundoNombre: String,
    tercerNombre: String,
    primerApellido: String!,
    segundoApellido: String,
    sexo: Sex!,
    fechaNacimiento: Date!,
    numeroCedula: Int!,
    numeroBancario: String,
    telefono: String!,
    zonaUrbanizacionId: Int!,
    calle: String!,
    numeroCasa: Int!
  ): UsuarioResponse!

  crearEstadoPais(
    token: String!,
    estado: String!
  ): EstadoPaisResponse!

  actualizarEstadoPais(
    token: String!,
    id: Int!,
    estado: String!
    vigencia: Boolean!
  ): EstadoPaisResponse!
}
`;

export default schemas;
