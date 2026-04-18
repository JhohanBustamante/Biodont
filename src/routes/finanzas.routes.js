const express = require('express');
const router = express.Router();
const finanzasController = require('../controllers/finanzas.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', finanzasController.verTodos);
router.get('/odontograma/:odontogramaId', finanzasController.verPorOdontograma);
router.get('/:id', finanzasController.verPorId);
router.post('/', finanzasController.crear);
router.put('/:id', finanzasController.actualizar);
router.patch('/:id/estado', finanzasController.actualizarEstado);
router.delete('/:id', finanzasController.eliminar);

module.exports = router;
