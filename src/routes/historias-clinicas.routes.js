const express = require('express');
const router = express.Router();

const {
  createOrUpdateHistoriaClinica,
  getHistoriaClinicaByPaciente
} = require('../controllers/historias-clinicas.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/paciente/:pacienteId', getHistoriaClinicaByPaciente);
router.post('/', createOrUpdateHistoriaClinica);

module.exports = router;