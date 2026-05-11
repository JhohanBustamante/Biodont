const prisma = require('../config/prisma');
const AppError = require('../errors/AppError');

const pagoMovimientoService = {};

const MOVIMIENTO_INCLUDE = {
  pagos: { orderBy: { fecha: 'asc' } },
  paciente: { select: { id: true, nombre: true, apellido: true } },
  cita: { select: { id: true, fecha: true, motivo: true } },
  odontograma: { select: { id: true, version: true } },
};

pagoMovimientoService.verPorMovimiento = async (movimientoId) => {
  const movimiento = await prisma.movimiento.findUnique({ where: { id: Number(movimientoId) } });
  if (!movimiento) throw new AppError('Movimiento no encontrado', 404);

  return await prisma.pagoMovimiento.findMany({
    where: { movimientoId: Number(movimientoId) },
    orderBy: { fecha: 'asc' },
  });
};

pagoMovimientoService.crear = async (movimientoId, { monto, fecha, metodoPago }) => {
  if (monto === undefined || monto === null || !fecha) {
    throw new AppError('Monto y fecha son obligatorios', 400);
  }
  if (isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new AppError('El monto debe ser mayor a cero', 400);
  }

  const movimiento = await prisma.movimiento.findUnique({
    where: { id: Number(movimientoId) },
    include: { pagos: true },
  });
  if (!movimiento) throw new AppError('Movimiento no encontrado', 404);

  await prisma.pagoMovimiento.create({
    data: {
      movimientoId: Number(movimientoId),
      monto: Number(monto),
      fecha: new Date(fecha),
      metodoPago: metodoPago || null,
    },
  });

  // Auto-actualizar estado si la suma de pagos cubre el monto total
  const pagosActualizados = await prisma.pagoMovimiento.findMany({
    where: { movimientoId: Number(movimientoId) },
  });
  const totalPagado = pagosActualizados.reduce((acc, p) => acc + p.monto, 0);

  if (totalPagado >= movimiento.monto && movimiento.estado !== 'PAGADO') {
    await prisma.movimiento.update({
      where: { id: Number(movimientoId) },
      data: { estado: 'PAGADO' },
    });
  }

  return await prisma.movimiento.findUnique({
    where: { id: Number(movimientoId) },
    include: MOVIMIENTO_INCLUDE,
  });
};

pagoMovimientoService.eliminar = async (movimientoId, pagoId) => {
  const movimiento = await prisma.movimiento.findUnique({
    where: { id: Number(movimientoId) },
  });
  if (!movimiento) throw new AppError('Movimiento no encontrado', 404);

  const pago = await prisma.pagoMovimiento.findFirst({
    where: { id: Number(pagoId), movimientoId: Number(movimientoId) },
  });
  if (!pago) throw new AppError('Pago no encontrado', 404);

  await prisma.pagoMovimiento.delete({ where: { id: Number(pagoId) } });

  // Revertir estado a PENDIENTE si el total ya no cubre el monto
  if (movimiento.estado === 'PAGADO') {
    const pagosRestantes = await prisma.pagoMovimiento.findMany({
      where: { movimientoId: Number(movimientoId) },
    });
    const totalRestante = pagosRestantes.reduce((acc, p) => acc + p.monto, 0);
    if (totalRestante < movimiento.monto) {
      await prisma.movimiento.update({
        where: { id: Number(movimientoId) },
        data: { estado: 'PENDIENTE' },
      });
    }
  }

  return await prisma.movimiento.findUnique({
    where: { id: Number(movimientoId) },
    include: MOVIMIENTO_INCLUDE,
  });
};

module.exports = pagoMovimientoService;
