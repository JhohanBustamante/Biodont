const {
  createOrUpdateHistoriaClinicaService,
  getHistoriaClinicaByPacienteService
} = require('../services/historias-clinicas.service');

const getHistoriaClinicaByPaciente = async (req, res) => {
  try {
    const historia = await getHistoriaClinicaByPacienteService(req.params.pacienteId);

    return res.status(200).json({
      ok: true,
      data: historia
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      message: error.message
    });
  }
};

const createOrUpdateHistoriaClinica = async (req, res) => {
  try {
    const historia = await createOrUpdateHistoriaClinicaService(req.body, req.user);

    return res.status(200).json({
      ok: true,
      message: 'Historia clínica guardada correctamente',
      data: historia
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrUpdateHistoriaClinica,
  getHistoriaClinicaByPaciente
};