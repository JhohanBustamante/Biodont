const prisma = require('../config/prisma');

/**
 * Exporta pacientes en formato plano.
 * Columnas compatibles con el importador → round-trip garantizado.
 */
const exportarPacientes = async ({ soloActivos = false } = {}) => {
  const registros = await prisma.paciente.findMany({
    where: soloActivos ? { activo: true } : {},
    orderBy: { apellido: 'asc' },
  });

  return registros.map((p) => ({
    nombre:          p.nombre,
    apellido:        p.apellido,
    documento:       p.documento,
    telefono:        p.telefono ?? '',
    correo:          p.correo ?? '',
    fechaNacimiento: p.fechaNacimiento ? p.fechaNacimiento.toISOString().substring(0, 10) : '',
    direccion:       p.direccion ?? '',
    eps:             p.eps ?? '',
    alergias:        p.alergias ?? '',
    observaciones:   p.observaciones ?? '',
    activo:          p.activo ? 'SI' : 'NO',
  }));
};

/**
 * Exporta movimientos financieros.
 * Incluye paciente_documento para eventual re-importación futura.
 */
const exportarMovimientos = async ({ fechaDesde, fechaHasta, estado } = {}) => {
  const where = {};
  if (fechaDesde || fechaHasta) {
    where.fecha = {};
    if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
    if (fechaHasta) where.fecha.lte = new Date(`${fechaHasta}T23:59:59`);
  }
  if (estado) where.estado = estado.toUpperCase();

  const registros = await prisma.movimiento.findMany({
    where,
    orderBy: { fecha: 'desc' },
    include: {
      paciente: { select: { documento: true, nombre: true, apellido: true } },
    },
  });

  return registros.map((m) => ({
    fecha:              m.fecha.toISOString().substring(0, 10),
    tipo:               m.tipo,
    concepto:           m.concepto,
    monto:              m.monto,
    estado:             m.estado,
    metodoPago:         m.metodoPago ?? '',
    nota:               m.nota ?? '',
    diagnosticoRef:     m.diagnosticoRef ?? '',
    paciente_documento: m.paciente?.documento ?? '',
    paciente_nombre:    m.paciente ? `${m.paciente.nombre} ${m.paciente.apellido}` : '',
  }));
};

/**
 * Exporta citas.
 * Incluye paciente_documento para re-enlace futuro.
 */
const exportarCitas = async ({ fechaDesde, fechaHasta, estado } = {}) => {
  const where = {};
  if (fechaDesde || fechaHasta) {
    where.fecha = {};
    if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
    if (fechaHasta) where.fecha.lte = new Date(`${fechaHasta}T23:59:59`);
  }
  if (estado) where.estado = estado.toUpperCase();

  const registros = await prisma.cita.findMany({
    where,
    orderBy: { fecha: 'desc' },
    include: {
      paciente: { select: { documento: true, nombre: true, apellido: true } },
    },
  });

  return registros.map((c) => ({
    fecha:              c.fecha.toISOString().substring(0, 10),
    hora:               c.fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
    motivo:             c.motivo,
    tipoAtencion:       c.tipoAtencion ?? '',
    estado:             c.estado,
    paciente_documento: c.paciente?.documento ?? '',
    paciente_nombre:    c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : '',
  }));
};

/**
 * Exporta tratamientos.
 * Incluye paciente_documento para re-enlace futuro.
 */
const exportarTratamientos = async ({ soloActivos = false } = {}) => {
  const registros = await prisma.tratamiento.findMany({
    where: soloActivos ? { estado: 'ACTIVO' } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      paciente: { select: { documento: true, nombre: true, apellido: true } },
    },
  });

  return registros.map((t) => ({
    descripcion:        t.descripcion,
    estado:             t.estado,
    monto:              t.monto ?? '',
    fechaInicio:        t.fechaInicio ? t.fechaInicio.toISOString().substring(0, 10) : '',
    fechaFin:           t.fechaFin    ? t.fechaFin.toISOString().substring(0, 10)    : '',
    paciente_documento: t.paciente?.documento ?? '',
    paciente_nombre:    t.paciente ? `${t.paciente.nombre} ${t.paciente.apellido}` : '',
  }));
};

/**
 * Orquesta la exportación de todas las entidades solicitadas.
 * Devuelve un objeto con las hojas a generar.
 */
const exportarService = async (config) => {
  const hojas = [];

  if (config.pacientes?.incluir) {
    const datos = await exportarPacientes({ soloActivos: config.pacientes.soloActivos });
    hojas.push({ nombre: 'Pacientes', datos, total: datos.length });
  }

  if (config.movimientos?.incluir) {
    const datos = await exportarMovimientos({
      fechaDesde: config.movimientos.fechaDesde,
      fechaHasta: config.movimientos.fechaHasta,
      estado:     config.movimientos.estado,
    });
    hojas.push({ nombre: 'Movimientos', datos, total: datos.length });
  }

  if (config.citas?.incluir) {
    const datos = await exportarCitas({
      fechaDesde: config.citas.fechaDesde,
      fechaHasta: config.citas.fechaHasta,
      estado:     config.citas.estado,
    });
    hojas.push({ nombre: 'Citas', datos, total: datos.length });
  }

  if (config.tratamientos?.incluir) {
    const datos = await exportarTratamientos({ soloActivos: config.tratamientos.soloActivos });
    hojas.push({ nombre: 'Tratamientos', datos, total: datos.length });
  }

  return {
    hojas,
    generadoEn: new Date().toISOString(),
  };
};

module.exports = { exportarService };
