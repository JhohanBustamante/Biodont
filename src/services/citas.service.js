const citasService = {};
const prisma = require("../config/prisma");
const BadRequestError = require("../errors/BadRequestError");
const ESTADOS_VALIDOS = ["PROGRAMADA", "CANCELADA", "ATENDIDA"];

citasService.crear = async ({ fecha, motivo, observaciones, pacienteId }) => {
  if (!pacienteId || !motivo || !fecha)
    throw new BadRequestError("Datos faltantes para crear la cita");
  return await prisma.cita.create({
    data: {
      fecha: new Date(fecha),
      motivo,
      observaciones,
      pacienteId,
    },
  });
};

citasService.verPorPaciente = async ({ pacienteId }) => {
  if (!pacienteId) throw new BadRequestError("Id del paciente no enviado.");

  return await prisma.cita.findMany({
    where: { pacienteId },
    orderBy: { fecha: "asc" },
  });
};

citasService.verPorPacienteYEstado = async ({ pacienteId, estado }) => {
  if (!pacienteId || !estado)
    throw new BadRequestError("Id del paciente o estado no enviados.");
  if (!ESTADOS_VALIDOS.includes(estado))
    throw new BadRequestError(
      "Estado no válido. Solo se acepta PROGRAMADA, CANCELADA o ATENDIDA",
    );

  return await prisma.cita.findMany({
    where: { pacienteId, estado },
    orderBy: { fecha: "asc" },
  });
};

citasService.actualizarEstado = async ({ id, estado }) => {
  if (!id || !estado)
    throw new BadRequestError("Id del paciente o estado no enviados.");
  if (!ESTADOS_VALIDOS.includes(estado))
    throw new BadRequestError(
      "Estado no válido. Solo se acepta PROGRAMADA, CANCELADA o ATENDIDA",
    );

  return await prisma.cita.update({
    where: { id },
    data: { estado }
  });
};

module.exports = citasService;
