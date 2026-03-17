const prisma = require('../config/prisma');

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getEndOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
};

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const formatHour = (dateValue) => {
  const date = new Date(dateValue);

  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const mapEstadoCita = (estado) => {
  const normalized = String(estado || '').toUpperCase();

  if (normalized === 'CONFIRMADA') return 'CONFIRMADA';
  if (normalized === 'PROGRAMADA') return 'PENDIENTE';
  return normalized || 'PENDIENTE';
};

const getDashboardSummaryService = async () => {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  const startOfMonth = getStartOfMonth();

  const [
    pacientesRegistrados,
    pacientesNuevosMes,
    citasHoy,
    citasPendientesHoy,
    ingresosHoyAggregate,
    tratamientosActivos,
    agendaHoyRaw
  ] = await Promise.all([
    prisma.paciente.count(),

    prisma.paciente.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    }),

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
        estado: {
          in: ['PROGRAMADA']
        }
      }
    }),

    prisma.movimiento.aggregate({
      _sum: {
        monto: true
      },
      where: {
        tipo: 'INGRESO',
        fecha: {
          gte: startOfToday,
          lt: endOfToday
        }
      }
    }),

    prisma.tratamiento.count({
      where: {
        estado: 'ACTIVO'
      }
    }),

    prisma.cita.findMany({
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
      select: {
        id: true,
        fecha: true,
        motivo: true,
        estado: true,
        paciente: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    })
  ]);

  const agendaHoy = agendaHoyRaw.map((item) => ({
    id: item.id,
    hora: formatHour(item.fecha),
    pacienteNombre: `${item.paciente?.nombre || ''} ${item.paciente?.apellido || ''}`.trim(),
    motivo: item.motivo,
    estado: mapEstadoCita(item.estado)
  }));

  return {
    stats: {
      pacientesRegistrados,
      pacientesNuevosMes,
      citasHoy,
      citasPendientesHoy,
      ingresosDia: ingresosHoyAggregate._sum.monto || 0,
      tratamientosActivos
    },
    agendaHoy
  };
};

module.exports = {
  getDashboardSummaryService
};