-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "metodoPago" TEXT,
    "pacienteId" INTEGER,
    "citaId" INTEGER,
    "odontogramaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movimiento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Movimiento_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "Cita" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Movimiento_odontogramaId_fkey" FOREIGN KEY ("odontogramaId") REFERENCES "Odontograma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Movimiento" ("citaId", "concepto", "createdAt", "estado", "fecha", "id", "metodoPago", "monto", "odontogramaId", "pacienteId", "tipo") SELECT "citaId", "concepto", "createdAt", "estado", "fecha", "id", "metodoPago", "monto", "odontogramaId", "pacienteId", "tipo" FROM "Movimiento";
DROP TABLE "Movimiento";
ALTER TABLE "new_Movimiento" RENAME TO "Movimiento";
CREATE INDEX "Movimiento_pacienteId_idx" ON "Movimiento"("pacienteId");
CREATE INDEX "Movimiento_citaId_idx" ON "Movimiento"("citaId");
CREATE INDEX "Movimiento_odontogramaId_idx" ON "Movimiento"("odontogramaId");
CREATE INDEX "Movimiento_fecha_idx" ON "Movimiento"("fecha");
CREATE INDEX "Movimiento_estado_idx" ON "Movimiento"("estado");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
