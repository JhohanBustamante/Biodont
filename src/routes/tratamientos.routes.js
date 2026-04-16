const express = require('express');
const router = express.Router();
const tratamientosController = require('../controllers/tratamientos.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/paciente/:pacienteId', tratamientosController.verPorPaciente);
router.get('/:id', tratamientosController.verPorId);
router.post('/', tratamientosController.crear);
router.patch('/:id', tratamientosController.actualizar);
router.delete('/:id', tratamientosController.eliminar);

module.exports = router;
