-- AlterTable
ALTER TABLE "Cita" ADD COLUMN "tipoAtencion" TEXT;

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "numeroHistoria" TEXT NOT NULL,
    "fechaApertura" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoCivil" TEXT,
    "sexo" TEXT,
    "ocupacion" TEXT,
    "lugarResidencia" TEXT,
    "acompananteNombre" TEXT,
    "acompananteTelefono" TEXT,
    "acompananteParentesco" TEXT,
    "motivoConsulta" TEXT,
    "enfermedadesSistemicas" JSONB,
    "antecedentesQuirurgicos" TEXT,
    "medicacionActual" JSONB,
    "alergiasGenerales" TEXT,
    "antecedentesHematologicos" TEXT,
    "ginecoObstetricos" TEXT,
    "habitos" TEXT,
    "antecedentesOdontologicos" TEXT,
    "higieneOral" JSONB,
    "declaracionAceptada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HistoriaClinica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaClinica_numeroHistoria_key" ON "HistoriaClinica"("numeroHistoria");

-- CreateIndex
CREATE INDEX "HistoriaClinica_pacienteId_idx" ON "HistoriaClinica"("pacienteId");

-- CreateIndex
CREATE INDEX "HistoriaClinica_usuarioId_idx" ON "HistoriaClinica"("usuarioId");

-- CreateIndex
CREATE INDEX "Cita_fecha_idx" ON "Cita"("fecha");

-- CreateIndex
CREATE INDEX "Movimiento_pacienteId_idx" ON "Movimiento"("pacienteId");

-- CreateIndex
CREATE INDEX "Movimiento_fecha_idx" ON "Movimiento"("fecha");

-- CreateIndex
CREATE INDEX "Paciente_documento_idx" ON "Paciente"("documento");

-- CreateIndex
CREATE INDEX "Tratamiento_usuarioId_idx" ON "Tratamiento"("usuarioId");

-- CreateIndex
CREATE INDEX "Usuario_correo_idx" ON "Usuario"("correo");
