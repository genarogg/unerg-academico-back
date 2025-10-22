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
  datosPersonales: DatosPersonales
  bitacora: [Bitacora]
  redirect: Redirect
}

type Bitacora {
  id: Int!
  usuarioId: Int!
  accion: String!
  type: AccionesBitacora!
  ip: String!
  mensaje: String
}

type DatosPersonales {
  id: Int!
  usuarioId: Int!
  direccionId: Int
  primerNombre: String
  segundoNombre: String
  tercerNombre: String
  primerApellido: String
  segundoApellido: String
  sexo: Sex
  fechaNacimiento: Date
  numeroCedula: Int
  numeroBancario: String
  telefono: String
  direccion: Direccion
  expediente: Expediente
  createdAt: Date
  updatedAt: Date
}

type Direccion {
  id: Int!
  zonaUrbanizacionId: Int!
  calle: String!
  numeroCasa: Int!
  zonaUrbanizacion: ZonaUrbanizacion!
}

type ZonaUrbanizacion {
  id: Int!
  estadoPaisId: Int!
  codigoPostal: Int!
  zona: String!
  vigencia: Vigencia!
  createdAt: Date!
  updatedAt: Date!
  estadoPais: EstadoPais!
}

type EstadoPais {
  id: Int!
  estado: String!
  vigencia: Vigencia!
  createdAt: Date!
  updatedAt: Date!
}

type Expediente {
  id: Int!
  datosPersonalesId: Int!
  documentos: [Documento]
  estudios: [Estudio]
  createdAt: Date!
  updatedAt: Date!
}

type NivelEstudio {
  id: Int!
  nivelAcademico: NivelAcademico!
  tipo: TipoEstudio!
  Estudio: [Estudio]
  createdAt: Date!
  updatedAt: Date!
}

type Meta {
  total: Int
  page: Int
  limit: Int
  totalPages: Int
}

type Campus {
  id: Int!
  tipo: TipoCampus!
  zonaUrbanizacion: ZonaUrbanizacion!
  area: [Area]  
  fechaCreacion: Date!
  fechaCierre: Date!
  createdAt: Date!
  updatedAt: Date!
}

type Area {
  id: Int!
  campusId: Int!
  nombre: String!
  programa: [Programa]  
  campus: Campus
  createdAt: Date!
  updatedAt: Date!
}

type Programa {
  id: Int!
  areaId: Int!
  nombre: String!
  nivelAcademico: NivelAcademico!
  modalidad: Modalidad!
  duracionAnios: Int!
  vigencia: Vigencia!
  area: Area
  createdAt: Date!
  updatedAt: Date!
}

type Estudio {
  id: Int!
  expedienteId: Int!
  nivelEstudioId: Int!
  casaEstudioId: Int!
  titulo: String!
  fecha: Date!
  imgDocumento: String!
  notas: [NotaEstudio]
  estatus: EstatusDocumento!
  expediente: Expediente
  nivelEstudio: NivelEstudio
  casaEstudio: CasaEstudio
}

type TipoDocumento {
  id: Int!
  nombre: String!
  vigencia: Vigencia!
  createdAt: Date!
  updatedAt: Date!
}

type Documento {
  id: Int!
  tipoDocumentoId: Int!
  expedienteId: Int!
  url: String!
  estatus: EstatusDocumento!
  tipoDocumento: TipoDocumento
  expediente: Expediente
  createdAt: Date!
  updatedAt: Date!
}

type CasaEstudio {
  id: Int!
  nombre: String!
  estudio: [Estudio]
  createdAt: Date!
  updatedAt: Date!
}

type NotaEstudio {
  id: Int!
  estudioId: Int!
  url: String!
  numeroPagina: Int!
  createdAt: Date!
  updatedAt: Date!
}

type Redirect {
  id: Int!
  usuarioId: Int!
  datosPersonales: Boolean!
  createdAt: Date!
  updatedAt: Date!
  usuario: Usuario
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

type DatosPersonalesResponse {
  type: String!
  message: String!
  data: DatosPersonales
}

type CampusResponse {
  type: String!
  message: String!
  data: Campus
}

type CampusesResponse {
  type: String!
  message: String!
  data: [Campus]!
  meta: Meta
}

type AreaResponse {
  type: String!
  message: String!
  data: Area
}

type AreasResponse {
  type: String!
  message: String!
  data: [Area]!
  meta: Meta
}

type ProgramaResponse {
  type: String!
  message: String!
  data: Programa
}

type ProgramasResponse {
  type: String!
  message: String!
  data: [Programa]!
  meta: Meta
}

type RedirectResponse {
  type: String!
  message: String!
  data: Redirect
}

##############################################
# Inputs
##############################################
input DocumentoInput {
  tipoDocumento: String!
  archivo: String!
}

input DireccionInput {
  estadoId: String!
  zonaId: String!
  calle: String!
  numeroCasa: String!
  codigoPostal: Int!
}

input ExpedienteInput {
  documentos: [DocumentoInput!]!
}

input DatosPersonalesInput {
  primerNombre: String!
  segundoNombre: String
  tercerNombre: String
  primerApellido: String!
  segundoApellido: String
  numeroCedula: String!
  numeroBancario: String!
  telefono: String!
  fechaNacimiento: Date!
  sexo: Sex!
  direccion: DireccionInput!
  expediente: ExpedienteInput!
}


##############################################
# Query y Mutation
##############################################

type Query {
  hello: String!
  generatePDF(template: String!, data: String!): String  
  validarSesion(token: String!): UsuarioResponse!
  getUsuarios(token: String!, filtro: String, page:Int, limit: Int): UsuariosResponse!
  getUsuario(token: String!, id: Int): UsuarioResponse!

  obtenerEstados(
    token: String!
  ): EstadosPaisResponse!

  obtenerZonasUrbanizacion(
    token: String!
    estadoId: Int
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

  obtenerDatosPersonales(
    token: String!
  ): DatosPersonalesResponse!

  obtenerCampuses(token: String!): CampusesResponse!
  obtenerAreas(token: String!): AreasResponse!

  obtenerRedirect(token: String!): RedirectResponse!
}

type Mutation {
  registerUsuario(
    email: String!
    password: String!
    cedula: Int!
    captchaToken: String
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
  ): DatosPersonalesResponse!

  actualizarDatosPersonales(
    token: String!,
    primerNombre: String,
    segundoNombre: String,
    tercerNombre: String,
    primerApellido: String,
    segundoApellido: String,
    sexo: Sex,
    fechaNacimiento: Date,
    numeroCedula: Int,
    numeroBancario: String,
    telefono: String,
    zonaUrbanizacionId: Int,
    calle: String,
    numeroCasa: Int
  ): DatosPersonalesResponse!

  crearEstadoPais(
    token: String!,
    estado: String!
  ): EstadoPaisResponse!

  actualizarEstadoPais(
    token: String!,
    id: Int!,
    estado: String!,
    vigencia: Vigencia!
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
    vigencia: Vigencia
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

  crearRedirect(
    token: String!
    usuarioId: Int!
    datosPersonales: Boolean!
  ): RedirectResponse!

  actualizarRedirect(
    token: String!
    id: Int!
    datosPersonales: Boolean
  ): RedirectResponse!


 registroDatosArranque(
    token: String!
    datosPersonales: DatosPersonalesInput!
  ): UsuarioResponse!
}
`;

export default schemas;