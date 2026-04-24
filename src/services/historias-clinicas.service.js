const prisma = require('../config/prisma');
const AppError = require('../errors/AppError');

const generateHistoriaNumber = (pacienteId) => {
  const year = new Date().getFullYear();
  return `HC-${year}-${String(pacienteId).padStart(4, '0')}`;
};

const getHistoriaClinicaByPacienteService = async (pacienteId) => {
  const pacienteIdNumber = Number(pacienteId);

  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteIdNumber }
  });

  if (!paciente) {
    throw new AppError('Paciente no encontrado', 404);
  }

  const historia = await prisma.historiaClinica.findFirst({
    where: {
      pacienteId: pacienteIdNumber
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      odontograma: {
        include: {
          dientes: {
            include: {
              superficies: true
            }
          }
        }
      }
    }
  });

  return {
    paciente,
    historia
  };
};

const createOrUpdateHistoriaClinicaService = async (data, user) => {
  const {
    pacienteId,
    numeroHistoria,
    estadoCivil,
    sexo,
    ocupacion,
    lugarResidencia,
    acompananteNombre,
    acompananteTelefono,
    acompananteParentesco,
    motivoConsulta,
    enfermedadesSistemicas,
    antecedentesQuirurgicos,
    medicacionActual,
    alergiasGenerales,
    antecedentesHematologicos,
    ginecoObstetricos,
    habitos,
    antecedentesOdontologicos,
    higieneOral,
    declaracionAceptada
  } = data;

  if (!pacienteId) {
    throw new AppError('El paciente es obligatorio', 400);
  }

  const pacienteIdNumber = Number(pacienteId);

  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteIdNumber }
  });

  if (!paciente) {
    throw new AppError('Paciente no encontrado', 404);
  }

  const historiaExistente = await prisma.historiaClinica.findFirst({
    where: {
      pacienteId: pacienteIdNumber
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const odontogramaActivo = await prisma.odontograma.findFirst({
    where: {
      pacienteId: pacienteIdNumber,
      activo: true
    },
    orderBy: {
      version: 'desc'
    }
  });

  const historiaNumeroFinal =
    numeroHistoria?.trim() ||
    historiaExistente?.numeroHistoria ||
    generateHistoriaNumber(pacienteIdNumber);

  const payload = {
    numeroHistoria: historiaNumeroFinal,
    usuarioId: user?.id || null,
    odontogramaId: odontogramaActivo?.id || null,
    estadoCivil: estadoCivil || null,
    sexo: sexo || null,
    ocupacion: ocupacion || null,
    lugarResidencia: lugarResidencia || null,
    acompananteNombre: acompananteNombre || null,
    acompananteTelefono: acompananteTelefono || null,
    acompananteParentesco: acompananteParentesco || null,
    motivoConsulta: motivoConsulta || null,
    enfermedadesSistemicas: enfermedadesSistemicas || null,
    antecedentesQuirurgicos: antecedentesQuirurgicos || null,
    medicacionActual: medicacionActual || null,
    alergiasGenerales: alergiasGenerales || null,
    antecedentesHematologicos: antecedentesHematologicos || null,
    ginecoObstetricos: ginecoObstetricos || null,
    habitos: habitos || null,
    antecedentesOdontologicos: antecedentesOdontologicos || null,
    higieneOral: higieneOral || null,
    declaracionAceptada: Boolean(declaracionAceptada)
  };

  const historia = await prisma.historiaClinica.upsert({
    where: { numeroHistoria: historiaNumeroFinal },
    create: {
      pacienteId: pacienteIdNumber,
      ...payload
    },
    update: payload,
    include: {
      odontograma: {
        include: {
          dientes: {
            include: {
              superficies: true
            }
          }
        }
      }
    }
  });

  await prisma.paciente.update({
    where: { id: pacienteIdNumber },
    data: {
      historiaClinicaCompleta: true
    }
  });

  return historia;
};

module.exports = {
  createOrUpdateHistoriaClinicaService,
  getHistoriaClinicaByPacienteService
};