-- AlterTable: añadir monto y odontogramaId a Tratamiento
ALTER TABLE "Tratamiento" ADD COLUMN "monto" REAL;
ALTER TABLE "Tratamiento" ADD COLUMN "odontogramaId" INTEGER;

-- CreateIndex
CREATE INDEX "Tratamiento_odontogramaId_idx" ON "Tratamiento"("odontogramaId");
