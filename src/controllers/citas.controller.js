const {
  createCitaService,
  listCitasService,
  getCitasStatsService,
  getUpcomingCitasService,
  getAgendaSummaryService
} = require('../services/citas.service');



const createCita = async (req, res) => {
  try {
    const cita = await createCitaService(req.body);

    return res.status(201).json({
      ok: true,
      message: 'Cita registrada correctamente',
      data: cita
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

const listCitas = async (req, res) => {
  try {
    const citas = await listCitasService();

    return res.status(200).json({
      ok: true,
      data: citas
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener el listado de citas'
    });
  }
};

const getCitasStats = async (req, res) => {
  try {
    const stats = await getCitasStatsService();

    return res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudieron obtener las estadísticas de citas'
    });
  }
};

const getUpcomingCitas = async (req, res) => {
  try {
    const citas = await getUpcomingCitasService();

    return res.status(200).json({
      ok: true,
      data: citas
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudieron obtener las próximas citas'
    });
  }
};

const getAgendaSummary = async (req, res) => {
  try {
    const summary = await getAgendaSummaryService();

    return res.status(200).json({
      ok: true,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener el resumen de agenda'
    });
  }
};

module.exports = {
  createCita,
  listCitas,
  getCitasStats,
  getUpcomingCitas,
  getAgendaSummary,
  
};