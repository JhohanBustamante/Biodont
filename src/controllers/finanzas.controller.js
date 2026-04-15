const finanzasController = {};
const finanzasService = require('../services/finanzas.service');

finanzasController.crear = async (req, res) => {
  try {
    const movimiento = await finanzasService.crear(req.body);
    return res.status(201).json({ ok: true, data: movimiento });
  } catch (error) {
    console.error('Error en crear movimiento:', error);
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

finanzasController.verTodos = async (req, res) => {
  try {
    const movimientos = await finanzasService.verTodos(req.query);
    return res.status(200).json({ ok: true, data: movimientos });
  } catch (error) {
    console.error('Error al listar movimientos:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};

finanzasController.verPorId = async (req, res) => {
  try {
    const movimiento = await finanzasService.verPorId(req.params.id);
    return res.status(200).json({ ok: true, data: movimiento });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

finanzasController.actualizarEstado = async (req, res) => {
  try {
    const movimiento = await finanzasService.actualizarEstado(req.params.id, req.body.estado);
    return res.status(200).json({ ok: true, data: movimiento });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

finanzasController.eliminar = async (req, res) => {
  try {
    await finanzasService.eliminar(req.params.id);
    return res.status(200).json({ ok: true, message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

module.exports = finanzasController;
