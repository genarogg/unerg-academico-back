const schemas = /* GraphQL */ `

##############################################
# Scalars
##############################################

scalar Upload
scalar Date

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
  DatosPersonales: DatosPersonales
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
   createdAt: Date!
  updatedAt: Date!
}

type Direccion {
  id: Int!
  zonaUrbanizacionId: Int!
  calle: String!
  numeroCasa: String!
  ZonaUrbanizacion: ZonaUrbanizacion!
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

type NivelEstudio {
  id: Int!
  nivelAcademico: String!
  tipo: String!
  Estudio: [Estudio]
}

type Meta {
  total: Int
  page: Int
  limit: Int,
  totalPages: Int
}
##############################################
# Tipos de respuesta y metadatos
##############################################

type UsuarioResponse {
  type: String!
  message: String!
  data: Usuario
}

type UsuariosResponse {
  type: String!
  message: String!
  data: [Usuario]!
  meta: Meta
}

type NotificacionResponse {
  type: String!
  message: String!
}

type EstadoPaisResponse {
  type: String!
  message: String!
  data: EstadoPais
}

type EstadosPaisResponse {
  type: String!
  message: String!
  data: [EstadoPais]
}

type ZonaUrbanizacionResponse {
  type: String!
  message: String!
  data: ZonaUrbanizacion
}

type ZonasUrbanizacionResponse {
  type: String!
  message: String!
  data: [ZonaUrbanizacion]
}

type Estudio {
  id: Int!
  expedienteId: Int!
  nivelEstudioId: Int!
  casaEstudioId: Int!
  titulo: String!
  fecha: Date!
  imgDocumento: String!
  notas: String!
  estatus: String!
  expediente: Expediente
  nivelEstudio: NivelEstudio
  casaEstudio: CasaEstudio
}

type TipoDocumento {
  id: Int!
  nombre: String!
  vigencia: String!
  createdAt: Date!
  updatedAt: Date!
}

type Documento {
  id: Int!
  tipoDocumentoId: Int!
  expedienteId: Int!
  url: String!
  estatus: String!
  tipoDocumento: TipoDocumento
  expediente: Expediente
  createdAt: Date!
  updatedAt: Date!
}

type CasaEstudio {
  id: Int!
  nombre: String!
  Estudio: [Estudio]
}

type EstudioResponse {
  type: String!
  message: String!
  data: Estudio
}

type EstudiosResponse {
  type: String!
  message: String!
  data: [Estudio]
}

type TipoDocumentoResponse {
  type: String!
  message: String!
  data: TipoDocumento
}

type TiposDocumentoResponse {
  type: String!
  message: String!
  data: [TipoDocumento]
}

type DocumentoResponse {
  type: String!
  message: String!
  data: Documento
}

type DocumentosResponse {
  type: String!
  message: String!
  data: [Documento]
}

type CasaEstudioResponse {
  type: String!
  message: String!
  data: CasaEstudio
}

type CasasEstudioResponse {
  type: String!
  message: String!
  data: [CasaEstudio]
}

##############################################
# Query y Mutation
##############################################

type Query {
  hello: String!
  generatePDF(template: String!, data: String!): String  
  validarSesion(token: String!): UsuarioResponse!
  getUsuarios(token: String!, filtro: String, page:Int, limit: Int): UsuariosResponse!
  getUsuario(token: String!, filtro: String): UsuarioResponse!


  obtenerEstados(
    token: String!
  ): EstadosPaisResponse!

  obtenerZonasUrbanizacion(
    token: String!
  ): ZonasUrbanizacionResponse!

  obtenerTipoDocumento(
    token: String!
    id: Int
  ): TiposDocumentoResponse!

  obtenerDocumentos(
    token: String!
    documentoId: Int
  ): DocumentosResponse!

  obtenerCasaEstudio(
    token: String!
    id: Int
  ): CasasEstudioResponse!

    obtenerEstudios(
    token: String!
    id: Int
    expedienteId: Int
  ): EstudiosResponse!
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
    estado: String!,
    vigencia: Boolean!
  ): EstadoPaisResponse!

  crearZonaUrbanizacion(
    token: String!,
    estadoPaisId: Int!,
    codigoPostal: Int!,
    zona: String!,
  ): ZonaUrbanizacionResponse!
  
  actualizarZonaUrbanizacion(
    token: String!,
    id: Int!,
    estadoPaisId: Int,
    codigoPostal: Int,
    zona: String,
    vigencia: Boolean!
  ): ZonaUrbanizacionResponse!

  crearTipoDocumento(
    token: String!,
    nombre: String!
  ): TipoDocumentoResponse!

  actualizarTipoDocumento(
    token: String!,
    id: Int!,
    nombre: String,
    vigencia: String
  ): TipoDocumentoResponse!

  crearDocumento(
    token: String!,
    tipoDocumentoId: Int!,
    expedienteId: Int!,
    url: String!
  ): DocumentoResponse!

  actualizarDocumento(
    token: String!,
    documentoId: Int!,
    tipoDocumentoId: Int,
    url: String,
    estatus: String
  ): DocumentoResponse!

  crearCasaEstudio(
    token: String!,
    nombre: String!
  ): CasaEstudioResponse!

  actualizarCasaEstudio(
    token: String!,
    id: Int!,
    nombre: String!
  ): CasaEstudioResponse!

   crearEstudio(
    token: String!
    expedienteId: Int!
    nivelEstudioId: Int!
    casaEstudioId: Int!
    titulo: String!
    fecha: Date!
    imgDocumento: String!
    notas: String
  ): EstudioResponse!

  actualizarEstudio(
    token: String!
    id: Int!
    expedienteId: Int
    nivelEstudioId: Int
    casaEstudioId: Int
    titulo: String
    fecha: Date
    imgDocumento: String
    notas: String
    estatus: String
  ): EstudioResponse!
}
`;

export default schemas;