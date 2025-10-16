-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Redirect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "datosPersonales" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Redirect_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Redirect" ("createdAt", "datosPersonales", "id", "updatedAt", "usuarioId") SELECT "createdAt", "datosPersonales", "id", "updatedAt", "usuarioId" FROM "Redirect";
DROP TABLE "Redirect";
ALTER TABLE "new_Redirect" RENAME TO "Redirect";
CREATE UNIQUE INDEX "Redirect_usuarioId_key" ON "Redirect"("usuarioId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
