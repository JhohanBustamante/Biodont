const odontogramaService = require("../services/odontograma.service");
const odontogramaController = {};

odontogramaController.verTodos = async (req, res) => {
  try {
    const odontogramas = await odontogramaService.verTodos(req.query);
    res.json(odontogramas);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

odontogramaController.crear = async (req, res) => {
  try {
    const odontograma = await odontogramaService.crear(req.body);
    res.status(201).json(odontograma);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

odontogramaController.versionar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await odontogramaService.versionar(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

odontogramaController.verPorUsuario = async (req, res) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const result = await odontogramaService.verPorUsuario(pacienteId);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

odontogramaController.verHistorial = async (req, res) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const result = await odontogramaService.verHistorial(pacienteId);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

module.exports = odontogramaController;
