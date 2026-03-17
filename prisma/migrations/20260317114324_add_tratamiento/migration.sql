/*
  Warnings:

  - You are about to drop the `Finanza` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `observaciones` on the `Cita` table. All the data in the column will be lost.
  - You are about to drop the column `activo` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `Paciente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documento]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "documento" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Finanza";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Tratamiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tratamiento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tratamiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL,
    "metodoPago" TEXT,
    "pacienteId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movimiento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "fecha" DATETIME NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cita_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cita" ("createdAt", "estado", "fecha", "id", "motivo", "pacienteId", "updatedAt") SELECT "createdAt", "estado", "fecha", "id", "motivo", "pacienteId", "updatedAt" FROM "Cita";
DROP TABLE "Cita";
ALTER TABLE "new_Cita" RENAME TO "Cita";
CREATE INDEX "Cita_pacienteId_idx" ON "Cita"("pacienteId");
CREATE INDEX "Cita_usuarioId_idx" ON "Cita"("usuarioId");
CREATE TABLE "new_Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "fechaNacimiento" DATETIME,
    "direccion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Paciente" ("apellido", "createdAt", "documento", "id", "nombre", "telefono", "updatedAt") SELECT "apellido", "createdAt", "documento", "id", "nombre", "telefono", "updatedAt" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_documento_key" ON "Paciente"("documento");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Tratamiento_pacienteId_idx" ON "Tratamiento"("pacienteId");

-- CreateIndex
CREATE INDEX "DiagnosticoSuperficie_dienteId_idx" ON "DiagnosticoSuperficie"("dienteId");

-- CreateIndex
CREATE INDEX "Diente_odontogramaId_idx" ON "Diente"("odontogramaId");

-- CreateIndex
CREATE INDEX "Odontograma_pacienteId_idx" ON "Odontograma"("pacienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_documento_key" ON "Usuario"("documento");
