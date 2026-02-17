const prisma = require("../config/prisma");
const BadRequestError = require("../errors/BadRequestError");
const NotFoudError = require("../errors/NotFoundError");
const TIPO_FINANZA = ["INGRESO","EGRESO"]
const ESTADO_FINANZA = ["PENDIENTE", "PAGADA", "ATRASADA"]
const pacientesService = require("../services/pacientes.service")

const finanzasService = {};

finanzasService.crear = async ({ fecha, monto, tipo, estado, nota, pacienteId }) => {
    if (!fecha || !monto || !tipo || !estado) throw new BadRequestError("Datos requeridos incompletos.")
    if(!TIPO_FINANZA.includes(tipo.toUpperCase().trim())) throw new BadRequestError("No se envió un tipo de finanza valido")
    if(!ESTADO_FINANZA.includes(estado.toUpperCase().trim())) throw new BadRequestError("No se envió un estado de finanza valido")
    
    if(typeof pacienteId !== 'number' || !pacienteId) throw new BadRequestError("Se debe enviar un id de paciente valido.")
    const id = Number(pacienteId);
    const pacientes = await pacientesService.verPorId({ id });
    if(!pacientes) throw new NotFoudError("El id del paciente enviado no corresponde a algun paciente registrado.")

        return await prisma.finanza.create({
        data: {
            fecha: new Date(fecha),
            estado, monto, pacienteId, nota, tipo
        }
    })
};

finanzasService.verTodos = async () => { };

finanzasService.verPorId = async () => { };

finanzasService.eliminar = async () => { };

module.exports = finanzasService;