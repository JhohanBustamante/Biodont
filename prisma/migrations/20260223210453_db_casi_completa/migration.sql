/*
  Warnings:

  - You are about to alter the column `monto` on the `Finanza` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.

*/
-- CreateTable
CREATE TABLE "Odontograma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Odontograma_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "odontogramaId" INTEGER NOT NULL,
    CONSTRAINT "Diente_odontogramaId_fkey" FOREIGN KEY ("odontogramaId") REFERENCES "Odontograma" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiagnosticoSuperficie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "superficie" TEXT NOT NULL,
    "diagnostico" JSONB NOT NULL,
    "dienteId" INTEGER NOT NULL,
    CONSTRAINT "DiagnosticoSuperficie_dienteId_fkey" FOREIGN KEY ("dienteId") REFERENCES "Diente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Finanza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "nota" TEXT,
    "pacienteId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Finanza_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Finanza" ("createdAt", "estado", "fecha", "id", "monto", "nota", "pacienteId", "tipo") SELECT "createdAt", "estado", "fecha", "id", "monto", "nota", "pacienteId", "tipo" FROM "Finanza";
DROP TABLE "Finanza";
ALTER TABLE "new_Finanza" RENAME TO "Finanza";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
