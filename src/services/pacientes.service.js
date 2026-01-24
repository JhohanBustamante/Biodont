const prisma = require("../config/prisma");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const pacientesService = {};

pacientesService.crear = async ({
  nombre,
  apellido,
  documento,
  nota,
  telefono,
}) => {
  if (!nombre || !apellido || !documento)
    throw new BadRequestError("Datos incompletos, revisar solicitud.");
  nombre = nombre.toLowerCase().trim();
  apellido = apellido.toLowerCase().trim();
  documento = documento.trim();

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

pacientesService.verTodos = async () => {
  return await prisma.paciente.findMany({
    where: { activo: true },
    orderBy: { createdAt: "asc" },
  });
};

pacientesService.verPorId = async ({ id }) => {
  return await prisma.paciente.findUnique({
    where: { id },
  });
};

pacientesService.eliminar = async ({ id }) => {
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

pacientesService.verPorDocumento = async ({documento})=>{
    return await prisma.paciente.findUnique({
        where: { documento }
    })
}

module.exports = pacientesService;