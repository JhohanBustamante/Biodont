const { getDashboardSummaryService } = require('../services/dashboard.service');

const getDashboardSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummaryService();

    return res.status(200).json({
      ok: true,
      data: summary
    });
  } catch (error) {
    console.error('Error en dashboard:', error);

    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener el resumen del dashboard'
    });
  }
};

module.exports = {
  getDashboardSummary
};