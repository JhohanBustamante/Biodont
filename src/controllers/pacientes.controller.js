const {
  createPacienteService,
  listPacientesService,
  getPacienteByIdService,
  getRecentPacientesService,
  getPacientesQuickInfoService,
  updatePacienteService,
  importarPacientesService,
  toggleActivoPacienteService,
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

const updatePaciente = async (req, res) => {
  try {
    const paciente = await updatePacienteService(req.params.id, req.body);
    return res.status(200).json({
      ok: true,
      message: 'Paciente actualizado correctamente',
      data: paciente
    });
  } catch (error) {
    const status = error.message === 'Paciente no encontrado' ? 404 : 400;
    return res.status(status).json({ ok: false, message: error.message });
  }
};

const importarPacientes = async (req, res) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ ok: false, message: 'Se requiere un array de filas no vacío' });
    }
    if (rows.length > 1000) {
      return res.status(400).json({ ok: false, message: 'El archivo no puede superar 1000 filas por importación' });
    }
    const resultado = await importarPacientesService(rows);
    return res.status(200).json({ ok: true, data: resultado });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error al procesar la importación',
    });
  }
};

const toggleActivoPaciente = async (req, res) => {
  try {
    const { activo, force = false } = req.body;
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ ok: false, message: 'El campo activo debe ser booleano' });
    }
    const paciente = await toggleActivoPacienteService(req.params.id, activo, force);
    const message = activo ? 'Paciente activado correctamente' : 'Paciente desactivado correctamente';
    return res.json({ ok: true, message, data: paciente });
  } catch (err) {
    if (err.needsConfirmation) {
      return res.status(409).json({ ok: false, message: err.message, pendientes: err.pendientes });
    }
    return res.status(err.statusCode || 500).json({
      ok: false,
      message: err.statusCode ? err.message : 'Error al cambiar estado del paciente',
    });
  }
};

module.exports = {
  createPaciente,
  listPacientes,
  getPacienteById,
  getRecentPacientes,
  getPacientesQuickInfo,
  updatePaciente,
  importarPacientes,
  toggleActivoPaciente,
};