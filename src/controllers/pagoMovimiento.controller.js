const pagoMovimientoController = {};
const pagoMovimientoService = require('../services/pagoMovimiento.service');

pagoMovimientoController.verPorMovimiento = async (req, res) => {
  try {
    const pagos = await pagoMovimientoService.verPorMovimiento(req.params.id);
    return res.status(200).json({ ok: true, data: pagos });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

pagoMovimientoController.crear = async (req, res) => {
  try {
    const movimiento = await pagoMovimientoService.crear(req.params.id, req.body);
    return res.status(201).json({ ok: true, data: movimiento });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

pagoMovimientoController.eliminar = async (req, res) => {
  try {
    const movimiento = await pagoMovimientoService.eliminar(req.params.id, req.params.pagoId);
    return res.status(200).json({ ok: true, data: movimiento });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor',
    });
  }
};

module.exports = pagoMovimientoController;
