const prisma = require('../config/prisma');

const generateHistoriaNumber = (pacienteId) => {
  const year = new Date().getFullYear();
  return `HC-${year}-${String(pacienteId).padStart(4, '0')}`;
};

const getHistoriaClinicaByPacienteService = async (pacienteId) => {
  const paciente = await prisma.paciente.findUnique({
    where: { id: Number(pacienteId) }
  });

  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }

  const historia = await prisma.historiaClinica.findFirst({
    where: {
      pacienteId: Number(pacienteId)
    },
    orderBy: {
      createdAt: 'desc'
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
    throw new Error('El paciente es obligatorio');
  }

  const paciente = await prisma.paciente.findUnique({
    where: { id: Number(pacienteId) }
  });

  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }

  const historiaExistente = await prisma.historiaClinica.findFirst({
    where: {
      pacienteId: Number(pacienteId)
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const historiaNumeroFinal =
    numeroHistoria?.trim() ||
    historiaExistente?.numeroHistoria ||
    generateHistoriaNumber(pacienteId);

  let historia;

  if (historiaExistente) {
    historia = await prisma.historiaClinica.update({
      where: { id: historiaExistente.id },
      data: {
        numeroHistoria: historiaNumeroFinal,
        usuarioId: user?.id || null,
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
      }
    });
  } else {
    historia = await prisma.historiaClinica.create({
      data: {
        pacienteId: Number(pacienteId),
        usuarioId: user?.id || null,
        numeroHistoria: historiaNumeroFinal,
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
      }
    });
  }

  await prisma.paciente.update({
    where: { id: Number(pacienteId) },
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