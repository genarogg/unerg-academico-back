/*
  Warnings:

  - You are about to drop the column `email` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `correo` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CedulaAutorizada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "CedulaAutorizada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'DOCENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("createdAt", "id", "password", "rol", "updatedAt") SELECT "createdAt", "id", "password", "rol", "updatedAt" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
