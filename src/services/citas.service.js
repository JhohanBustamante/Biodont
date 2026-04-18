const prisma = require('../config/prisma');

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getEndOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
};

const formatHour = (dateValue) => {
  const date = new Date(dateValue);

  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);

  return date.toLocaleDateString('es-CO');
};

const createDateTime = (fecha, hora) => {
  return new Date(`${fecha}T${hora}:00`);
};

const createCitaService = async (data) => {
  const {
    pacienteId,
    usuarioId,
    fecha,
    hora,
    motivo,
    estado,
    tipoAtencion
  } = data;

  if (!pacienteId || !fecha || !hora || !motivo) {
    throw new Error('Paciente, fecha, hora y motivo son obligatorios');
  }

  const paciente = await prisma.paciente.findUnique({
    where: { id: Number(pacienteId) }
  });

  if (!paciente) {
    throw new Error('El paciente seleccionado no existe');
  }

  if (usuarioId) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) }
    });

    if (!usuario) {
      throw new Error('El profesional seleccionado no existe');
    }
  }

  const fechaCompleta = createDateTime(fecha, hora);

  const cita = await prisma.cita.create({
    data: {
      pacienteId: Number(pacienteId),
      usuarioId: usuarioId ? Number(usuarioId) : null,
      fecha: fechaCompleta,
      motivo: motivo.trim(),
      estado: estado || 'PROGRAMADA',
      tipoAtencion: tipoAtencion?.trim() || null
    }
  });

  return cita;
};

const listCitasService = async ({ estado, tipoAtencion, pacienteId, fechaDesde, fechaHasta } = {}) => {
  const where = {};

  if (estado) where.estado = estado.toUpperCase().trim();
  if (tipoAtencion) where.tipoAtencion = tipoAtencion;
  if (pacienteId) where.pacienteId = Number(pacienteId);
  if (fechaDesde || fechaHasta) {
    where.fecha = {};
    if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      where.fecha.lte = hasta;
    }
  }

  const citas = await prisma.cita.findMany({
    where,
    orderBy: { fecha: 'asc' },
    include: {
      paciente: { select: { nombre: true, apellido: true } },
      usuario: { select: { nombre: true, apellido: true, rol: true } }
    }
  });

  return citas.map((cita) => ({
    id: cita.id,
    hora: formatHour(cita.fecha),
    fecha: formatDate(cita.fecha),
    pacienteNombre: `${cita.paciente.nombre} ${cita.paciente.apellido}`.trim(),
    profesional: cita.usuario
      ? `${cita.usuario.nombre} ${cita.usuario.apellido}`.trim()
      : 'Sin asignar',
    motivo: cita.motivo,
    tipoAtencion: cita.tipoAtencion || 'General',
    estado: cita.estado
  }));
};

const getCitasStatsService = async () => {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();

  const [citasHoy, confirmadas, canceladas] = await Promise.all([
    prisma.cita.count({
      where: {
        fecha: {
          gte: startOfToday,
          lt: endOfToday
        }
      }
    }),
    prisma.cita.count({
      where: {
        fecha: {
          gte: startOfToday,
          lt: endOfToday
        },
        estado: 'CONFIRMADA'
      }
    }),
    prisma.cita.count({
      where: {
        fecha: {
          gte: startOfToday,
          lt: endOfToday
        },
        estado: 'CANCELADA'
      }
    })
  ]);

  return {
    citasHoy,
    confirmadas,
    canceladas
  };
};

const getUpcomingCitasService = async () => {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();

  const citas = await prisma.cita.findMany({
    where: {
      fecha: {
        gte: startOfToday,
        lt: endOfToday
      }
    },
    orderBy: {
      fecha: 'asc'
    },
    take: 5,
    include: {
      paciente: {
        select: {
          nombre: true,
          apellido: true
        }
      },
      usuario: {
        select: {
          nombre: true,
          apellido: true
        }
      }
    }
  });

  return citas.map((cita) => ({
    id: cita.id,
    hora: formatHour(cita.fecha),
    pacienteNombre: `${cita.paciente.nombre} ${cita.paciente.apellido}`.trim(),
    motivo: cita.motivo,
    profesional: cita.usuario
      ? `${cita.usuario.nombre} ${cita.usuario.apellido}`.trim()
      : 'Sin asignar',
    estado: cita.estado
  }));
};

const getAgendaSummaryService = async () => {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();

  const citas = await prisma.cita.findMany({
    where: {
      fecha: {
        gte: startOfToday,
        lt: endOfToday
      }
    },
    orderBy: {
      fecha: 'asc'
    }
  });

  if (citas.length === 0) {
    return {
      primerTurno: 'Sin agenda',
      ultimoTurno: 'Sin agenda',
      espaciosDisponibles: 0
    };
  }

  const primerTurno = formatHour(citas[0].fecha);
  const ultimoTurno = formatHour(citas[citas.length - 1].fecha);
  const espaciosDisponibles = Math.max(0, 10 - citas.length);

  return {
    primerTurno,
    ultimoTurno,
    espaciosDisponibles
  };
};



const ESTADOS_VALIDOS = ['PROGRAMADA', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'];

const updateCitaEstadoService = async (id, estado) => {
  if (!estado || !ESTADOS_VALIDOS.includes(estado.toUpperCase().trim())) {
    throw new Error(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  const cita = await prisma.cita.findUnique({ where: { id: Number(id) } });
  if (!cita) throw new Error('Cita no encontrada');

  return await prisma.cita.update({
    where: { id: Number(id) },
    data: { estado: estado.toUpperCase().trim() }
  });
};

module.exports = {
  createCitaService,
  listCitasService,
  getCitasStatsService,
  getUpcomingCitasService,
  getAgendaSummaryService,
  updateCitaEstadoService
};