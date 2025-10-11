-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'DOCENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER,
    CONSTRAINT "Docente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bitacora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accion" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "mensaje" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatosPersonales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "tercerNombre" TEXT,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "sexo" TEXT NOT NULL,
    "fechaNacimiento" DATETIME NOT NULL,
    "numeroCedula" INTEGER NOT NULL,
    "numeroBancario" TEXT,
    "telefono" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "direccionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DatosPersonales_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatosPersonales_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calle" TEXT NOT NULL,
    "numeroCasa" INTEGER NOT NULL,
    "zonaUrbanizacionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Direccion_zonaUrbanizacionId_fkey" FOREIGN KEY ("zonaUrbanizacionId") REFERENCES "ZonaUrbanizacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ZonaUrbanizacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigoPostal" INTEGER NOT NULL,
    "zona" TEXT NOT NULL,
    "vigencia" TEXT NOT NULL DEFAULT 'ACTIVO',
    "estadoPaisId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ZonaUrbanizacion_estadoPaisId_fkey" FOREIGN KEY ("estadoPaisId") REFERENCES "EstadoPais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EstadoPais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL,
    "vigencia" TEXT NOT NULL DEFAULT 'ACTIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Expediente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datosPersonalesId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expediente_datosPersonalesId_fkey" FOREIGN KEY ("datosPersonalesId") REFERENCES "DatosPersonales" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CedulaAutorizada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" INTEGER NOT NULL,
    "vigencia" TEXT NOT NULL DEFAULT 'ACTIVO',
    "usuarioId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CedulaAutorizada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "vigencia" TEXT NOT NULL DEFAULT 'ACTIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoDocumentoId" INTEGER NOT NULL,
    "expedienteId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Documento_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Documento_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NivelEstudio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nivelAcademico" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CasaEstudio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Estudio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expedienteId" INTEGER NOT NULL,
    "nivelEstudioId" INTEGER NOT NULL,
    "casaEstudioId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "imgDocumento" TEXT NOT NULL,
    "notas" TEXT NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Estudio_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Estudio_nivelEstudioId_fkey" FOREIGN KEY ("nivelEstudioId") REFERENCES "NivelEstudio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Estudio_casaEstudioId_fkey" FOREIGN KEY ("casaEstudioId") REFERENCES "CasaEstudio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zona_urbanizacion_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Area" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "campus_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Area_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Programa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "area_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivelAcademico" TEXT NOT NULL,
    "modalidad" TEXT NOT NULL,
    "duracion_anios" INTEGER NOT NULL,
    "vigencia" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Programa_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_usuario_id_key" ON "Docente"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "DatosPersonales_usuarioId_key" ON "DatosPersonales"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoPais_estado_key" ON "EstadoPais"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "CedulaAutorizada_cedula_key" ON "CedulaAutorizada"("cedula");
