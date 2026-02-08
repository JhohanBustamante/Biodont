const prisma = require("../config/prisma");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");

const pacientesService = {};

const CAMPOS_PERMITIDOS = [
  "nombre",
  "apellido",
  "documento",
  "telefono",
  "nota",
];

pacientesService.crear = async ({
  nombre,
  apellido,
  documento,
  nota,
  telefono,
}) => {
  if (!nombre.trim() || !apellido.trim() || !documento.trim())
    throw new BadRequestError("Datos incompletos, revisar solicitud.");

  nombre = nombre.toLowerCase().trim();
  apellido = apellido.toLowerCase().trim();
  documento = documento.trim();
  telefono = telefono;

  if (
    await prisma.paciente.findUnique({
      where: { documento },
    })
  )
    throw new ConflictError("Documento ya usado por otro usuario");

  return await prisma.paciente.create({
    data: {
      nombre,
      apellido,
      documento,
      nota,
      telefono,
    },
  });
};

pacientesService.verTodos = async (queries) => {
  const where = { activo: true };
  const nombre = queries.nombre?.trim();
  const apellido = queries.apellido?.trim();
  const documento = queries.documento?.trim();
  const telefono = queries.telefono?.trim();
  if (nombre) where.nombre = { contains: nombre.toLowerCase() };
  if (apellido) where.apellido = { contains: apellido.toLowerCase() };
  if (documento) where.documento = { contains: documento };
  if (telefono) where.telefono = { contains: telefono };
  console.log(queries)
  console.log(where)

  return await prisma.paciente.findMany({
    where,
    orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
  });
};

pacientesService.verPorId = async ({ id }) => {
  return await prisma.paciente.findUnique({
    where: { id },
  });
};

pacientesService.eliminar = async ({ id }) => {
  id = Number(id);
  if (!id) throw new BadRequestError("Id del paciente no enviado.");
  const paciente = await prisma.paciente.findUnique({
    where: { id },
  });
  if (!paciente) throw new NotFoundError("Paciente no encontrado.");
  if (!paciente.activo) throw new BadRequestError("Paciente ya inactivo.");
  return await prisma.paciente.update({
    where: { id },
    data: { activo: false },
  });
};

pacientesService.activar = async ({ id }) => {
  return await prisma.paciente.update({
    where: { id },
    data: { activo: true },
  });
};

pacientesService.verPorDocumento = async ({ documento }) => {
  return await prisma.paciente.findUnique({
    where: { documento },
  });
};

pacientesService.actualizar = async ({ id, body }) => {
  if (!id) throw new BadRequestError("Id del paciente no enviado.");
  if(body == undefined) throw new BadRequestError("Datos no enviados.");
  const llaves = Object.keys(body);
  console.log(llaves);
  if (!llaves.length) throw new BadRequestError("Datos enviados vacíos.");
  const paciente = await prisma.paciente.findUnique({where: id});
  const data = body.reduce((acumulador, elemento) => {
    if (body[elemento] != undefined) {
      acumulador[elemento] = body[elemento];
      return acumulador;
    }
  }, {});

  if (Object.keys(data).length === 0)
    throw new BadRequestError(
      "No se han enviado datos para actualizar, revisar solicitud.",
    );

  if (data.nombre) data.nombre = data.nombre.trim().toUpperCase();
  if (data.apellido) data.apellido = data.apellido.trim().toUpperCase();
  if (data.documento) data.documento = data.documento.trim();

  if (data["documento"] != undefined) {
    const paciente = await pacientesService.verPorDocumento({
      documento: data["documento"],
    });
    const pacienteActual = await pacientesService.findUnique({
      id,
    });
    if (paciente.documento != pacienteActual.documento)
      throw new ConflictError("Documento ya usado por otro usuario.");
  }

  return await prisma.paciente.update({
    where: { id },
    data: data,
  });
};

module.exports = pacientesService;
