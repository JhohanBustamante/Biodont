const {
  createPacienteService,
  listPacientesService,
  getPacienteByIdService,
  getRecentPacientesService,
  getPacientesQuickInfoService
} = require('../services/pacientes.service');

const createPaciente = async (req, res) => {
  try {
    const paciente = await createPacienteService(req.body);

    return res.status(201).json({
      ok: true,
      message: 'Paciente registrado correctamente',
      data: paciente
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

const listPacientes = async (req, res) => {
  try {
    const pacientes = await listPacientesService();

    return res.status(200).json({
      ok: true,
      data: pacientes
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener el listado de pacientes'
    });
  }
};

const getPacienteById = async (req, res) => {
  try {
    const paciente = await getPacienteByIdService(req.params.id);

    return res.status(200).json({
      ok: true,
      data: paciente
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      message: error.message
    });
  }
};

const getRecentPacientes = async (req, res) => {
  try {
    const pacientes = await getRecentPacientesService();

    return res.status(200).json({
      ok: true,
      data: pacientes
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener pacientes recientes'
    });
  }
};

const getPacientesQuickInfo = async (req, res) => {
  try {
    const info = await getPacientesQuickInfoService();

    return res.status(200).json({
      ok: true,
      data: info
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener la información rápida'
    });
  }
};

module.exports = {
  createPaciente,
  listPacientes,
  getPacienteById,
  getRecentPacientes,
  getPacientesQuickInfo
};