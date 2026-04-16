const tratamientosController = {};
const tratamientosService = require('../services/tratamientos.service');

tratamientosController.crear = async (req, res) => {
  try {
    const tratamiento = await tratamientosService.crear(req.body);
    return res.status(201).json({ ok: true, data: tratamiento });
  } catch (error) {
    console.error('Error al crear tratamiento:', error);
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

tratamientosController.verPorPaciente = async (req, res) => {
  try {
    const tratamientos = await tratamientosService.verPorPaciente(req.params.pacienteId);
    return res.status(200).json({ ok: true, data: tratamientos });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

tratamientosController.verPorId = async (req, res) => {
  try {
    const tratamiento = await tratamientosService.verPorId(req.params.id);
    return res.status(200).json({ ok: true, data: tratamiento });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

tratamientosController.actualizar = async (req, res) => {
  try {
    const tratamiento = await tratamientosService.actualizar(req.params.id, req.body);
    return res.status(200).json({ ok: true, data: tratamiento });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

tratamientosController.eliminar = async (req, res) => {
  try {
    await tratamientosService.eliminar(req.params.id);
    return res.status(200).json({ ok: true, message: 'Tratamiento eliminado correctamente' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

module.exports = tratamientosController;
