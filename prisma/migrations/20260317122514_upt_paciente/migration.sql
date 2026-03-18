-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "fechaNacimiento" DATETIME,
    "direccion" TEXT,
    "eps" TEXT,
    "alergias" TEXT,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "historiaClinicaCompleta" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Paciente" ("apellido", "correo", "createdAt", "direccion", "documento", "fechaNacimiento", "id", "nombre", "telefono", "updatedAt") SELECT "apellido", "correo", "createdAt", "direccion", "documento", "fechaNacimiento", "id", "nombre", "telefono", "updatedAt" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_documento_key" ON "Paciente"("documento");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
