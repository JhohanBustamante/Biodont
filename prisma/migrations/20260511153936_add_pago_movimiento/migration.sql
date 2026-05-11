-- CreateTable
CREATE TABLE "PagoMovimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movimientoId" INTEGER NOT NULL,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL,
    "metodoPago" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PagoMovimiento_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PagoMovimiento_movimientoId_idx" ON "PagoMovimiento"("movimientoId");
