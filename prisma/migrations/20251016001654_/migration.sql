-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DatosPersonales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "direccionId" INTEGER,
    "primerNombre" TEXT,
    "segundoNombre" TEXT,
    "tercerNombre" TEXT,
    "primerApellido" TEXT,
    "segundoApellido" TEXT,
    "sexo" TEXT,
    "fechaNacimiento" DATETIME,
    "telefono" TEXT,
    "numeroCedula" INTEGER,
    "numeroBancario" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DatosPersonales_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatosPersonales_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DatosPersonales" ("createdAt", "direccionId", "fechaNacimiento", "id", "numeroBancario", "numeroCedula", "primerApellido", "primerNombre", "segundoApellido", "segundoNombre", "sexo", "telefono", "tercerNombre", "updatedAt", "usuarioId") SELECT "createdAt", "direccionId", "fechaNacimiento", "id", "numeroBancario", "numeroCedula", "primerApellido", "primerNombre", "segundoApellido", "segundoNombre", "sexo", "telefono", "tercerNombre", "updatedAt", "usuarioId" FROM "DatosPersonales";
DROP TABLE "DatosPersonales";
ALTER TABLE "new_DatosPersonales" RENAME TO "DatosPersonales";
CREATE UNIQUE INDEX "DatosPersonales_usuarioId_key" ON "DatosPersonales"("usuarioId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
