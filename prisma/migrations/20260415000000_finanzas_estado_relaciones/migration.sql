-- AlterTable: añadir estado, citaId y odontogramaId a Movimiento
ALTER TABLE "Movimiento" ADD COLUMN "estado" TEXT NOT NULL DEFAULT 'PENDIENTE';
ALTER TABLE "Movimiento" ADD COLUMN "citaId" INTEGER;
ALTER TABLE "Movimiento" ADD COLUMN "odontogramaId" INTEGER;

-- CreateIndex
CREATE INDEX "Movimiento_citaId_idx" ON "Movimiento"("citaId");
CREATE INDEX "Movimiento_odontogramaId_idx" ON "Movimiento"("odontogramaId");
CREATE INDEX "Movimiento_estado_idx" ON "Movimiento"("estado");
