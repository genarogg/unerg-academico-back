-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'DOCENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bitacora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "hora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha" DATETIME NOT NULL,
    "mensaje" TEXT,
    CONSTRAINT "Bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatosPersonales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "direccionId" INTEGER,
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
    CONSTRAINT "DatosPersonales_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatosPersonales_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zonaUrbanizacionId" INTEGER NOT NULL,
    "calle" TEXT NOT NULL,
    "numeroCasa" INTEGER NOT NULL,
    CONSTRAINT "Direccion_zonaUrbanizacionId_fkey" FOREIGN KEY ("zonaUrbanizacionId") REFERENCES "ZonaUrbanizacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ZonaUrbanizacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estadoPaisId" INTEGER NOT NULL,
    "codigoPostal" INTEGER NOT NULL,
    "zona" TEXT NOT NULL,
    CONSTRAINT "ZonaUrbanizacion_estadoPaisId_fkey" FOREIGN KEY ("estadoPaisId") REFERENCES "EstadoPais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EstadoPais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Expediente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datosPersonalesId" INTEGER NOT NULL,
    CONSTRAINT "Expediente_datosPersonalesId_fkey" FOREIGN KEY ("datosPersonalesId") REFERENCES "DatosPersonales" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CedulaAutorizada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" INTEGER NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'ACTIVO',
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "CedulaAutorizada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DatosPersonales_usuarioId_key" ON "DatosPersonales"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoPais_estado_key" ON "EstadoPais"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "CedulaAutorizada_cedula_key" ON "CedulaAutorizada"("cedula");
