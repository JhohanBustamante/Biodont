const prisma = require("../config/prisma");
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
  const { pacienteId, fecha, dientes } = body;

  if (!pacienteId) {
    throw new Error("El paciente es obligatorio");
  }

  const pacienteIdNumber = Number(pacienteId);

  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteIdNumber },
  });

  if (!paciente) {
    throw new Error("Paciente no encontrado");
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
    throw new Error("El paciente ya tiene un odontograma activo. Debe versionarse.");
  }

  return await prisma.odontograma.create({
    data: {
      paciente: {
        connect: { id: pacienteIdNumber },
      },
      version: 1,
      activo: true,
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
  const { pacienteId, dientes } = body;

  if (!pacienteId) {
    throw new Error("El paciente es obligatorio");
  }

  return await prisma.$transaction(async (tx) => {
    const actual = await tx.odontograma.findUnique({
      where: { id: Number(id) },
    });

    if (!actual) {
      throw new Error("Odontograma no encontrado");
    }

    if (actual.pacienteId !== Number(pacienteId)) {
      throw new Error("El odontograma no pertenece al paciente enviado");
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

    return nuevo;
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