-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tratamiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "odontogramaId" INTEGER,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "monto" REAL,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tratamiento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tratamiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tratamiento_odontogramaId_fkey" FOREIGN KEY ("odontogramaId") REFERENCES "Odontograma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tratamiento" ("createdAt", "descripcion", "estado", "fechaFin", "fechaInicio", "id", "monto", "odontogramaId", "pacienteId", "updatedAt", "usuarioId") SELECT "createdAt", "descripcion", "estado", "fechaFin", "fechaInicio", "id", "monto", "odontogramaId", "pacienteId", "updatedAt", "usuarioId" FROM "Tratamiento";
DROP TABLE "Tratamiento";
ALTER TABLE "new_Tratamiento" RENAME TO "Tratamiento";
CREATE INDEX "Tratamiento_pacienteId_idx" ON "Tratamiento"("pacienteId");
CREATE INDEX "Tratamiento_usuarioId_idx" ON "Tratamiento"("usuarioId");
CREATE INDEX "Tratamiento_odontogramaId_idx" ON "Tratamiento"("odontogramaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
