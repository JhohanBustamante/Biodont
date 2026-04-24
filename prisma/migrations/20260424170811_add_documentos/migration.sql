-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "nombre" TEXT NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" DATETIME,
    "ruta" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "tamanio" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Documento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Documento_nombreArchivo_key" ON "Documento"("nombreArchivo");

-- CreateIndex
CREATE INDEX "Documento_pacienteId_idx" ON "Documento"("pacienteId");

-- CreateIndex
CREATE INDEX "Documento_usuarioId_idx" ON "Documento"("usuarioId");
