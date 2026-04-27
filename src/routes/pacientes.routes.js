const express = require('express');
const router = express.Router();

const {
  createPaciente,
  listPacientes,
  getPacienteById,
  getRecentPacientes,
  getPacientesQuickInfo,
  updatePaciente,
  importarPacientes,
  toggleActivoPaciente,
} = require('../controllers/pacientes.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', listPacientes);
router.get('/recent', getRecentPacientes);
router.get('/quick-info', getPacientesQuickInfo);
router.get('/:id', getPacienteById);
router.post('/', createPaciente);
router.post('/importar', importarPacientes);
router.patch('/:id/activo', toggleActivoPaciente);
router.patch('/:id', updatePaciente);

module.exports = router;