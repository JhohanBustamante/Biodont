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

/**
 * Parsea el campo "activo" del archivo importado.
 * Acepta: SI, SÍ, YES, TRUE, 1  → true
 *         NO, FALSE, 0 y vacío  → false
 * Si el campo no viene en la fila devuelve undefined (Prisma no lo toca).
 */
const parseActivo = (val) => {
  const raw = String(val ?? '').trim();
  if (raw === '') return undefined;
  return /^(si|sí|yes|true|1)$/i.test(raw);
};

/**
 * Importación masiva de pacientes desde un array de filas ya parseadas.
 * Hace upsert por documento: crea si no existe, actualiza si ya existe.
 * Devuelve { importados, actualizados, errores }.
 */
const importarPacientesService = async (rows) => {
  const REQUIRED = ['nombre', 'apellido', 'documento'];
  let importados = 0;
  let actualizados = 0;
  const errores = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const fila = i + 2; // fila 1 = encabezado, filas de datos desde 2

    // Validar campos requeridos
    const missing = REQUIRED.filter(f => !row[f] || String(row[f]).trim() === '');
    if (missing.length > 0) {
      errores.push({ fila, documento: row.documento || '—', motivo: `Campos requeridos faltantes: ${missing.join(', ')}` });
      continue;
    }

    const documento = String(row.documento).trim();
    const activoValue = parseActivo(row.activo);

    const data = {
      nombre:          String(row.nombre).trim(),
      apellido:        String(row.apellido).trim(),
      documento,
      telefono:        row.telefono   ? String(row.telefono).trim()   : null,
      correo:          row.correo     ? String(row.correo).trim().toLowerCase() : null,
      fechaNacimiento: row.fechaNacimiento ? new Date(row.fechaNacimiento) : null,
      direccion:       row.direccion  ? String(row.direccion).trim()  : null,
      eps:             row.eps        ? String(row.eps).trim()        : null,
      alergias:        row.alergias   ? String(row.alergias).trim()   : null,
      observaciones:   row.observaciones ? String(row.observaciones).trim() : null,
      ...(activoValue !== undefined && { activo: activoValue }),
    };

    // Saltar si fechaNacimiento resultó inválida
    if (data.fechaNacimiento && isNaN(data.fechaNacimiento.getTime())) {
      data.fechaNacimiento = null;
    }

    try {
      const existing = await prisma.paciente.findUnique({ where: { documento } });
      if (existing) {
        await prisma.paciente.update({ where: { documento }, data });
        actualizados++;
      } else {
        await prisma.paciente.create({ data });
        importados++;
      }
    } catch (err) {
      errores.push({ fila, documento, motivo: err.message || 'Error desconocido' });
    }
  }

  return { importados, actualizados, errores };
};

const toggleActivoPacienteService = async (id, activo, force) => {
  const paciente = await prisma.paciente.findUnique({ where: { id: Number(id) } });
  if (!paciente) throw new AppError('Paciente no encontrado', 404);

  if (!activo && !force) {
    const [movimientosPendientes, odontogramasActivos] = await Promise.all([
      prisma.movimiento.count({ where: { pacienteId: Number(id), estado: 'PENDIENTE' } }),
      prisma.odontograma.count({ where: { pacienteId: Number(id), activo: true } }),
    ]);

    if (movimientosPendientes > 0 || odontogramasActivos > 0) {
      const err = new AppError('El paciente tiene items pendientes', 409);
      err.needsConfirmation = true;
      err.pendientes = { movimientosPendientes, odontogramasActivos };
      throw err;
    }
  }

  return await prisma.paciente.update({
    where: { id: Number(id) },
    data: { activo },
  });
};

module.exports = {
  createPacienteService,
  listPacientesService,
  getPacienteByIdService,
  getRecentPacientesService,
  getPacientesQuickInfoService,
  updatePacienteService,
  importarPacientesService,
  toggleActivoPacienteService,
};