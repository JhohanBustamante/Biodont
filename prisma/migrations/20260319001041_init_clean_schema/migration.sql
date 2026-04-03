-- CreateTable
CREATE TABLE "Paciente" (
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

-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "telefono" TEXT,
    "documento" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "odontogramaId" INTEGER,
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
    CONSTRAINT "HistoriaClinica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "HistoriaClinica_odontogramaId_fkey" FOREIGN KEY ("odontogramaId") REFERENCES "Odontograma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "fecha" DATETIME NOT NULL,
    "motivo" TEXT NOT NULL,
    "tipoAtencion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cita_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_documento_key" ON "Paciente"("documento");

-- CreateIndex
CREATE INDEX "Paciente_documento_idx" ON "Paciente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_documento_key" ON "Usuario"("documento");

-- CreateIndex
CREATE INDEX "Usuario_correo_idx" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaClinica_numeroHistoria_key" ON "HistoriaClinica"("numeroHistoria");

-- CreateIndex
CREATE INDEX "HistoriaClinica_pacienteId_idx" ON "HistoriaClinica"("pacienteId");

-- CreateIndex
CREATE INDEX "HistoriaClinica_usuarioId_idx" ON "HistoriaClinica"("usuarioId");

-- CreateIndex
CREATE INDEX "HistoriaClinica_odontogramaId_idx" ON "HistoriaClinica"("odontogramaId");

-- CreateIndex
CREATE INDEX "Cita_pacienteId_idx" ON "Cita"("pacienteId");

-- CreateIndex
CREATE INDEX "Cita_usuarioId_idx" ON "Cita"("usuarioId");

-- CreateIndex
CREATE INDEX "Cita_fecha_idx" ON "Cita"("fecha");

-- CreateIndex
CREATE INDEX "Tratamiento_pacienteId_idx" ON "Tratamiento"("pacienteId");

-- CreateIndex
CREATE INDEX "Tratamiento_usuarioId_idx" ON "Tratamiento"("usuarioId");

-- CreateIndex
CREATE INDEX "Movimiento_pacienteId_idx" ON "Movimiento"("pacienteId");

-- CreateIndex
CREATE INDEX "Movimiento_fecha_idx" ON "Movimiento"("fecha");

-- CreateIndex
CREATE INDEX "Odontograma_pacienteId_idx" ON "Odontograma"("pacienteId");

-- CreateIndex
CREATE INDEX "Odontograma_pacienteId_activo_idx" ON "Odontograma"("pacienteId", "activo");

-- CreateIndex
CREATE INDEX "Odontograma_pacienteId_version_idx" ON "Odontograma"("pacienteId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Odontograma_pacienteId_version_key" ON "Odontograma"("pacienteId", "version");

-- CreateIndex
CREATE INDEX "Diente_odontogramaId_idx" ON "Diente"("odontogramaId");

-- CreateIndex
CREATE INDEX "DiagnosticoSuperficie_dienteId_idx" ON "DiagnosticoSuperficie"("dienteId");
