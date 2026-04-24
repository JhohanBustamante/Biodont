const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../lib/upload');
const {
  listDocumentosByPaciente,
  createDocumento,
  getDocumentoArchivo,
  deleteDocumento,
} = require('../controllers/documentos.controller');

router.use(authMiddleware);

router.get('/paciente/:pacienteId', listDocumentosByPaciente);
router.post('/', upload.single('archivo'), createDocumento);
router.get('/:id/archivo', getDocumentoArchivo);
router.delete('/:id', deleteDocumento);

module.exports = router;
