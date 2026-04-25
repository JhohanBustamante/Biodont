const { exportarService } = require('../services/exportar.service');
const AppError = require('../errors/AppError');

const exportar = async (req, res) => {
  try {
    const config = req.body;

    const entidadesSolicitadas = ['pacientes', 'movimientos', 'citas', 'tratamientos']
      .filter((e) => config[e]?.incluir);

    if (entidadesSolicitadas.length === 0) {
      throw new AppError('Debes seleccionar al menos una entidad para exportar', 400);
    }

    const resultado = await exportarService(config);
    return res.status(200).json({ ok: true, data: resultado });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error al generar la exportación',
    });
  }
};

module.exports = { exportar };
