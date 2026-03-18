const express = require('express');
const router = express.Router();

const {
  createCita,
  listCitas,
  getCitasStats,
  getUpcomingCitas,
  getAgendaSummary
} = require('../controllers/citas.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', listCitas);
router.get('/stats', getCitasStats);
router.get('/upcoming', getUpcomingCitas);
router.get('/summary', getAgendaSummary);
router.post('/', createCita);

module.exports = router;