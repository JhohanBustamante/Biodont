-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Odontograma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "tipo" TEXT NOT NULL DEFAULT 'ADULTO',
    CONSTRAINT "Odontograma_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Odontograma" ("activo", "fecha", "id", "pacienteId", "version") SELECT "activo", "fecha", "id", "pacienteId", "version" FROM "Odontograma";
DROP TABLE "Odontograma";
ALTER TABLE "new_Odontograma" RENAME TO "Odontograma";
CREATE INDEX "Odontograma_pacienteId_idx" ON "Odontograma"("pacienteId");
CREATE INDEX "Odontograma_pacienteId_activo_idx" ON "Odontograma"("pacienteId", "activo");
CREATE INDEX "Odontograma_pacienteId_version_idx" ON "Odontograma"("pacienteId", "version");
CREATE UNIQUE INDEX "Odontograma_pacienteId_version_key" ON "Odontograma"("pacienteId", "version");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
