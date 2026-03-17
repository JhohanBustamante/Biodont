const prisma = require("../config/prisma");
const odontogramaService = {};


// Ver todos
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


//  Crear (primer odontograma)
odontogramaService.crear = async (req) => {
  const { pacienteId, fecha, dientes } = req.body;

  return await prisma.odontograma.create({
    data: {
      paciente: {
        connect: { id: Number(pacienteId) },
      },

      fecha: fecha ? new Date(fecha) : undefined,

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


// Versionar (UPDATE REAL)
odontogramaService.versionar = async (id, body) => {
    console.log("Servicio de versionar");
    console.log(body)
  const { pacienteId, dientes } = body;
  return await prisma.$transaction(async (tx) => {

    // 1️Buscar actual
    const actual = await tx.odontograma.findUnique({
      where: { id: Number(id) },
    });

    if (!actual) {
      throw new Error("Odontograma no encontrado");
    }

    // Desactivar actual
    await tx.odontograma.update({
      where: { id: Number(id) },
      data: { activo: false },
    });

    // 3Crear nueva versión
    const nuevo = await tx.odontograma.create({
      data: {
        paciente: {
          connect: { id: Number(pacienteId) },
        },
        version: actual.version + 1,
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
          include: { superficies: true },
        },
      },
    });

    return nuevo;
  });
};


//  Eliminar (soft delete)
odontogramaService.eliminar = async (id) => {
  return await prisma.odontograma.update({
    where: { id: Number(id) },
    data: {
      activo: false,
    },
  });
};


//  Ver activo por paciente
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


module.exports = odontogramaService;