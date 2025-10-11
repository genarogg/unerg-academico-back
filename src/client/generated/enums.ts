export enum AccionesBitacora {
  ActualizacionEstado = 'ACTUALIZACION_ESTADO',
  ActualizacionEstudio = 'ACTUALIZACION_ESTUDIO',
  ActualizacionUsuario = 'ACTUALIZACION_USUARIO',
  ActualizacionZonaUrbanizacion = 'ACTUALIZACION_ZONA_URBANIZACION',
  ChangePasswordEmail = 'CHANGE_PASSWORD_EMAIL',
  Error = 'ERROR',
  Login = 'LOGIN',
  ObtenerUsuario = 'OBTENER_USUARIO',
  RegistroEstado = 'REGISTRO_ESTADO',
  RegistroEstudio = 'REGISTRO_ESTUDIO',
  RegistroUsuario = 'REGISTRO_USUARIO',
  RegistroZonaUrbanizacion = 'REGISTRO_ZONA_URBANIZACION'
}

export enum EstatusDocumento {
  Aprobado = 'APROBADO',
  Pendiente = 'PENDIENTE',
  Rechazado = 'RECHAZADO'
}

export enum NivelAcademico {
  Doctora = 'DOCTORA',
  Especialidad = 'ESPECIALIDAD',
  Ingeniero = 'INGENIERO',
  Licenciado = 'LICENCIADO',
  Maestria = 'MAESTRIA',
  Tsu = 'TSU'
}

export enum Rol {
  Admin = 'ADMIN',
  Area = 'AREA',
  Docente = 'DOCENTE',
  Super = 'SUPER'
}

export enum Sex {
  Hombre = 'HOMBRE',
  Mujer = 'MUJER'
}

export enum TipoStudio {
  Postgrado = 'POSTGRADO',
  Pregrado = 'PREGRADO'
}

export enum Vigencia {
  Activo = 'ACTIVO',
  Inactivo = 'INACTIVO'
}
