const prisma = require('../config/prisma');
const AppError = require('../errors/AppError');

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const formatDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  return date.toLocaleDateString('es-CO');
};

const createPacienteService = async (data) => {
  const {
    nombre,
    apellido,
    documento,
    telefono,
    correo,
    fechaNacimiento,
    direccion,
    eps,
    alergias,
    observaciones
  } = data;

  if (!nombre || !apellido || !documento) {
    throw new AppError('Nombre, apellido y documento son obligatorios', 400);
  }

  const existingPaciente = await prisma.paciente.findUnique({
    where: { documento }
  });

  if (existingPaciente) {
    throw new AppError('Ya existe un paciente con ese documento', 409);
  }

  const paciente = await prisma.paciente.create({
    data: {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      documento: documento.trim(),
      telefono: telefono?.trim() || null,
      correo: correo?.trim() || null,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      direccion: direccion?.trim() || null,
      eps: eps?.trim() || null,
      alergias: alergias?.trim() || null,
      observaciones: observaciones?.trim() || null
    }
  });

  return paciente;
};

const listPacientesService = async () => {
  const pacientes = await prisma.paciente.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      citas: {
        orderBy: {
          fecha: 'desc'
        },
        take: 1,
        select: {
          fecha: true
        }
      }
    }
  });

  return pacientes.map((paciente) => ({
    id: paciente.id,
    nombreCompleto: `${paciente.nombre} ${paciente.apellido}`.trim(),
    documento: paciente.documento,
    telefono: paciente.telefono,
    eps: paciente.eps,
    activo: paciente.activo,
    fechaNacimiento: paciente.fechaNacimiento ? paciente.fechaNacimiento.toISOString().substring(0, 10) : null,
    ultimaCita: paciente.citas.length > 0 ? formatDate(paciente.citas[0].fecha) : 'Sin registro'
  }));
};

const getPacienteByIdService = async (id) => {
  const paciente = await prisma.paciente.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!paciente) {
    throw new AppError('Paciente no encontrado', 404);
  }

  return paciente;
};

const getRecentPacientesService = async () => {
  const pacientes = await prisma.paciente.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 3,
    select: {
      id: true,
      nombre: true,
      apellido: true,
      documento: true,
      telefono: true
    }
  });

  return pacientes.map((paciente) => ({
    id: paciente.id,
    nombreCompleto: `${paciente.nombre} ${paciente.apellido}`.trim(),
    documento: paciente.documento,
    telefono: paciente.telefono || 'Sin teléfono'
  }));
};

const getPacientesQuickInfoService = async () => {
  const startOfMonth = getStartOfMonth();

  const [
    pacientesConAlergias,
    pacientesNuevosMes,
    historiasPendientes
  ] = await Promise.all([
    prisma.paciente.count({
      where: {
        alergias: {
          not: null
        }
      }
    }),
    prisma.paciente.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    }),
    prisma.paciente.count({
      where: {
        historiaClinicaCompleta: false
      }
    })
  ]);

  return {
    alergiasRegistradas: pacientesConAlergias,
    pacientesNuevosMes,
    historiasPendientes
  };
};

const updatePacienteService = async (id, data) => {
  const paciente = await prisma.paciente.findUnique({ where: { id: Number(id) } });
  if (!paciente) throw new AppError('Paciente no encontrado', 404);

  const { nombre, apellido, documento, telefono, correo, fechaNacimiento, direccion, eps, alergias, observaciones } = data;

  if (documento && documento.trim() !== paciente.documento) {
    const existing = await prisma.paciente.findUnique({ where: { documento: documento.trim() } });
    if (existing) throw new AppError('Ya existe un paciente con ese documento', 409);
  }

  return await prisma.paciente.update({
    where: { id: Number(id) },
    data: {
      nombre: nombre?.trim() ?? paciente.nombre,
      apellido: apellido?.trim() ?? paciente.apellido,
      documento: documento?.trim() ?? paciente.documento,
      telefono: telefono?.trim() || null,
      correo: correo?.trim() || null,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      direccion: direccion?.trim() || null,
      eps: eps?.trim() || null,
      alergias: alergias?.trim() || null,
      observaciones: observaciones?.trim() || null,
    }
  });
};

module.exports = {
  createPacienteService,
  listPacientesService,
  getPacienteByIdService,
  getRecentPacientesService,
  getPacientesQuickInfoService,
  updatePacienteService
};