const prisma = require("../config/prisma");
const AppError = require("../errors/AppError");
const odontogramaService = {};

odontogramaService.verTodos = async (queries) => {
  const where = {};

  if (queries?.pacienteId) {
    where.pacienteId = Number(queries.pacienteId);
  }

  if (queries?.activo) {
    where.activo = queries.activo === "true";
  }

  return await prisma.odontograma.findMany({
    where,
    orderBy: {
      fecha: "desc",
    },
    include: {
      dientes: {
        include: {
          superficies: true,
        },
      },
    },
  });
};

odontogramaService.crear = async (body) => {
  const { pacienteId, fecha, dientes, tipo } = body;

  if (!pacienteId) {
    throw new AppError("El paciente es obligatorio", 400);
  }

  const pacienteIdNumber = Number(pacienteId);

  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteIdNumber },
  });

  if (!paciente) {
    throw new AppError("Paciente no encontrado", 404);
  }

  const odontogramaActivo = await prisma.odontograma.findFirst({
    where: {
      pacienteId: pacienteIdNumber,
      activo: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  if (odontogramaActivo) {
    throw new AppError("El paciente ya tiene un odontograma activo. Debe versionarse.", 409);
  }

  return await prisma.odontograma.create({
    data: {
      paciente: {
        connect: { id: pacienteIdNumber },
      },
      version: 1,
      activo: true,
      tipo: tipo === 'PEDIATRICO' ? 'PEDIATRICO' : tipo === 'MIXTO' ? 'MIXTO' : 'ADULTO',
      fecha: fecha ? new Date(fecha) : new Date(),
      dientes: {
        create: (dientes || []).map((diente) => ({
          numero: diente.numero,
          superficies: {
            create: (diente.superficies || []).map((superficie) => ({
              superficie: superficie.superficie,
              diagnostico: superficie.diagnostico,
            })),
          },
        })),
      },
    },
    include: {
      dientes: {
        include: {
          superficies: true,
        },
      },
    },
  });
};

odontogramaService.versionar = async (id, body) => {
  const { pacienteId, dientes, tipo } = body;

  if (!pacienteId) {
    throw new AppError("El paciente es obligatorio", 400);
  }

  return await prisma.$transaction(async (tx) => {
    const actual = await tx.odontograma.findUnique({
      where: { id: Number(id) },
    });

    if (!actual) {
      throw new AppError("Odontograma no encontrado", 404);
    }

    if (actual.pacienteId !== Number(pacienteId)) {
      throw new AppError("El odontograma no pertenece al paciente enviado", 403);
    }

    await tx.odontograma.update({
      where: { id: Number(id) },
      data: { activo: false },
    });

    const nuevo = await tx.odontograma.create({
      data: {
        paciente: {
          connect: { id: Number(pacienteId) },
        },
        version: actual.version + 1,
        activo: true,
        tipo: tipo === 'PEDIATRICO' ? 'PEDIATRICO' : tipo === 'MIXTO' ? 'MIXTO' : (actual.tipo ?? 'ADULTO'),
        fecha: new Date(),
        dientes: {
          create: (dientes || []).map((diente) => ({
            numero: diente.numero,
            superficies: {
              create: (diente.superficies || []).map((superficie) => ({
                superficie: superficie.superficie,
                diagnostico: superficie.diagnostico,
              })),
            },
          })),
        },
      },
      include: {
        dientes: {
          include: {
            superficies: true,
          },
        },
      },
    });

    // Transferir movimientos PENDIENTE al nuevo odontograma
    await tx.movimiento.updateMany({
      where: { odontogramaId: Number(id), estado: 'PENDIENTE' },
      data: {
        odontogramaId: nuevo.id,
        nota: `Transferido desde odontograma v${actual.version}`,
      },
    });

    return nuevo;
  });
};

odontogramaService.actualizarDientes = async (id, body) => {
  const { pacienteId, dientes, tipo } = body;

  if (!pacienteId) {
    throw new AppError("El paciente es obligatorio", 400);
  }

  return await prisma.$transaction(async (tx) => {
    const actual = await tx.odontograma.findUnique({
      where: { id: Number(id) },
    });

    if (!actual) {
      throw new AppError("Odontograma no encontrado", 404);
    }

    if (!actual.activo) {
      throw new AppError("Solo se puede editar el odontograma activo", 409);
    }

    if (actual.pacienteId !== Number(pacienteId)) {
      throw new AppError("El odontograma no pertenece al paciente enviado", 403);
    }

    // Eliminar todos los dientes actuales y reemplazarlos
    const dienteIds = await tx.diente.findMany({
      where: { odontogramaId: Number(id) },
      select: { id: true },
    });

    await tx.diagnosticoSuperficie.deleteMany({
      where: { dienteId: { in: dienteIds.map((d) => d.id) } },
    });

    await tx.diente.deleteMany({
      where: { odontogramaId: Number(id) },
    });

    if (tipo) {
      await tx.odontograma.update({
        where: { id: Number(id) },
        data: { tipo: tipo === 'PEDIATRICO' ? 'PEDIATRICO' : tipo === 'MIXTO' ? 'MIXTO' : 'ADULTO' },
      });
    }

    return await tx.odontograma.update({
      where: { id: Number(id) },
      data: {
        dientes: {
          create: (dientes || []).map((diente) => ({
            numero: diente.numero,
            superficies: {
              create: (diente.superficies || []).map((superficie) => ({
                superficie: superficie.superficie,
                diagnostico: superficie.diagnostico,
              })),
            },
          })),
        },
      },
      include: {
        dientes: {
          include: {
            superficies: true,
          },
        },
      },
    });
  });
};

odontogramaService.eliminar = async (id) => {
  return await prisma.odontograma.update({
    where: { id: Number(id) },
    data: {
      activo: false,
    },
  });
};

odontogramaService.verPorUsuario = async (pacienteId) => {
  return await prisma.odontograma.findFirst({
    where: {
      pacienteId: Number(pacienteId),
      activo: true,
    },
    orderBy: {
      version: "desc",
    },
    include: {
      dientes: {
        include: {
          superficies: true,
        },
      },
    },
  });
};

odontogramaService.verHistorial = async (pacienteId) => {
  return await prisma.odontograma.findMany({
    where: {
      pacienteId: Number(pacienteId),
    },
    orderBy: {
      version: "desc",
    },
    include: {
      dientes: {
        include: {
          superficies: true,
        },
      },
    },
  });
};

module.exports = odontogramaService;