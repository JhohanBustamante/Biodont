const prisma = require('../config/prisma');
const AppError = require('../errors/AppError');

const ESTADOS_VALIDOS = ['ACTIVO', 'FINALIZADO', 'PAUSADO'];

const include = {
  paciente: { select: { id: true, nombre: true, apellido: true, documento: true } },
  usuario: { select: { id: true, nombre: true, apellido: true, rol: true } },
  odontograma: { select: { id: true, version: true, fecha: true } },
};

const tratamientosService = {};

tratamientosService.crear = async ({ pacienteId, usuarioId, odontogramaId, descripcion, estado, monto, fechaInicio, fechaFin }) => {
  if (!pacienteId || !descripcion) {
    throw new AppError('El paciente y la descripción son obligatorios', 400);
  }

  const paciente = await prisma.paciente.findUnique({ where: { id: Number(pacienteId) } });
  if (!paciente) throw new AppError('El paciente indicado no existe', 404);

  if (usuarioId) {
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    if (!usuario) throw new AppError('El usuario indicado no existe', 404);
  }

  if (odontogramaId) {
    const odontograma = await prisma.odontograma.findUnique({ where: { id: Number(odontogramaId) } });
    if (!odontograma) throw new AppError('El odontograma indicado no existe', 404);
  }

  const estadoFinal = estado ? estado.toUpperCase().trim() : 'ACTIVO';
  if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
    throw new AppError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400);
  }

  return await prisma.tratamiento.create({
    data: {
      pacienteId: Number(pacienteId),
      usuarioId: usuarioId ? Number(usuarioId) : null,
      odontogramaId: odontogramaId ? Number(odontogramaId) : null,
      descripcion,
      estado: estadoFinal,
      monto: monto !== undefined && monto !== null ? Number(monto) : null,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaFin: fechaFin ? new Date(fechaFin) : null,
    },
    include,
  });
};

tratamientosService.verPorPaciente = async (pacienteId) => {
  const paciente = await prisma.paciente.findUnique({ where: { id: Number(pacienteId) } });
  if (!paciente) throw new AppError('El paciente indicado no existe', 404);

  return await prisma.tratamiento.findMany({
    where: { pacienteId: Number(pacienteId) },
    orderBy: { createdAt: 'desc' },
    include,
  });
};

tratamientosService.verPorId = async (id) => {
  const tratamiento = await prisma.tratamiento.findUnique({
    where: { id: Number(id) },
    include,
  });

  if (!tratamiento) throw new AppError('Tratamiento no encontrado', 404);

  return tratamiento;
};

tratamientosService.actualizar = async (id, { descripcion, estado, monto, fechaInicio, fechaFin, usuarioId, odontogramaId }) => {
  const tratamiento = await prisma.tratamiento.findUnique({ where: { id: Number(id) } });
  if (!tratamiento) throw new AppError('Tratamiento no encontrado', 404);

  if (estado && !ESTADOS_VALIDOS.includes(estado.toUpperCase().trim())) {
    throw new AppError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400);
  }

  const data = {};
  if (descripcion !== undefined) data.descripcion = descripcion;
  if (estado !== undefined) data.estado = estado.toUpperCase().trim();
  if (monto !== undefined) data.monto = monto !== null ? Number(monto) : null;
  if (fechaInicio !== undefined) data.fechaInicio = fechaInicio ? new Date(fechaInicio) : null;
  if (fechaFin !== undefined) data.fechaFin = fechaFin ? new Date(fechaFin) : null;
  if (usuarioId !== undefined) data.usuarioId = usuarioId ? Number(usuarioId) : null;
  if (odontogramaId !== undefined) data.odontogramaId = odontogramaId ? Number(odontogramaId) : null;

  return await prisma.tratamiento.update({
    where: { id: Number(id) },
    data,
    include,
  });
};

tratamientosService.eliminar = async (id) => {
  const tratamiento = await prisma.tratamiento.findUnique({ where: { id: Number(id) } });
  if (!tratamiento) throw new AppError('Tratamiento no encontrado', 404);

  await prisma.tratamiento.delete({ where: { id: Number(id) } });
};

module.exports = tratamientosService;
