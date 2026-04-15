const prisma = require('../config/prisma');
const AppError = require('../errors/AppError');

const TIPOS_VALIDOS = ['INGRESO', 'EGRESO'];
const ESTADOS_VALIDOS = ['PENDIENTE', 'PAGADO', 'CANCELADO'];

const finanzasService = {};

finanzasService.crear = async ({ tipo, concepto, monto, fecha, estado, metodoPago, pacienteId, citaId, odontogramaId }) => {
  if (!tipo || !concepto || monto === undefined || !fecha) {
    throw new AppError('Los campos tipo, concepto, monto y fecha son obligatorios', 400);
  }

  if (!TIPOS_VALIDOS.includes(tipo.toUpperCase().trim())) {
    throw new AppError(`Tipo de movimiento inválido. Valores permitidos: ${TIPOS_VALIDOS.join(', ')}`, 400);
  }

  const estadoFinal = estado ? estado.toUpperCase().trim() : 'PENDIENTE';
  if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
    throw new AppError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400);
  }

  if (isNaN(Number(monto)) || Number(monto) < 0) {
    throw new AppError('El monto debe ser un número mayor o igual a cero', 400);
  }

  if (pacienteId) {
    const paciente = await prisma.paciente.findUnique({ where: { id: Number(pacienteId) } });
    if (!paciente) throw new AppError('El paciente indicado no existe', 404);
  }

  if (citaId) {
    const cita = await prisma.cita.findUnique({ where: { id: Number(citaId) } });
    if (!cita) throw new AppError('La cita indicada no existe', 404);
  }

  if (odontogramaId) {
    const odontograma = await prisma.odontograma.findUnique({ where: { id: Number(odontogramaId) } });
    if (!odontograma) throw new AppError('El odontograma indicado no existe', 404);
  }

  return await prisma.movimiento.create({
    data: {
      tipo: tipo.toUpperCase().trim(),
      concepto,
      monto: Number(monto),
      fecha: new Date(fecha),
      estado: estadoFinal,
      metodoPago: metodoPago || null,
      pacienteId: pacienteId ? Number(pacienteId) : null,
      citaId: citaId ? Number(citaId) : null,
      odontogramaId: odontogramaId ? Number(odontogramaId) : null,
    },
    include: {
      paciente: { select: { id: true, nombre: true, apellido: true } },
      cita: { select: { id: true, fecha: true, motivo: true } },
      odontograma: { select: { id: true, version: true } },
    },
  });
};

finanzasService.verTodos = async ({ tipo, estado, pacienteId, citaId, odontogramaId, fechaDesde, fechaHasta } = {}) => {
  const where = {};

  if (tipo) where.tipo = tipo.toUpperCase().trim();
  if (estado) where.estado = estado.toUpperCase().trim();
  if (pacienteId) where.pacienteId = Number(pacienteId);
  if (citaId) where.citaId = Number(citaId);
  if (odontogramaId) where.odontogramaId = Number(odontogramaId);

  if (fechaDesde || fechaHasta) {
    where.fecha = {};
    if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
    if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
  }

  return await prisma.movimiento.findMany({
    where,
    orderBy: { fecha: 'desc' },
    include: {
      paciente: { select: { id: true, nombre: true, apellido: true } },
      cita: { select: { id: true, fecha: true, motivo: true } },
      odontograma: { select: { id: true, version: true } },
    },
  });
};

finanzasService.verPorId = async (id) => {
  const movimiento = await prisma.movimiento.findUnique({
    where: { id: Number(id) },
    include: {
      paciente: { select: { id: true, nombre: true, apellido: true } },
      cita: { select: { id: true, fecha: true, motivo: true } },
      odontograma: { select: { id: true, version: true } },
    },
  });

  if (!movimiento) throw new AppError('Movimiento no encontrado', 404);

  return movimiento;
};

finanzasService.actualizarEstado = async (id, estado) => {
  if (!estado || !ESTADOS_VALIDOS.includes(estado.toUpperCase().trim())) {
    throw new AppError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400);
  }

  const movimiento = await prisma.movimiento.findUnique({ where: { id: Number(id) } });
  if (!movimiento) throw new AppError('Movimiento no encontrado', 404);

  return await prisma.movimiento.update({
    where: { id: Number(id) },
    data: { estado: estado.toUpperCase().trim() },
  });
};

finanzasService.eliminar = async (id) => {
  const movimiento = await prisma.movimiento.findUnique({ where: { id: Number(id) } });
  if (!movimiento) throw new AppError('Movimiento no encontrado', 404);

  await prisma.movimiento.delete({ where: { id: Number(id) } });
};

module.exports = finanzasService;
