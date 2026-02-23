const odontogramaController = require("../controllers/odontograma.controller")
const express = require("express")
const router = express.Router();

router.get('', odontogramaController.verTodos)

router.post('', odontogramaController.crear)

router.put('', odontogramaController.actualizar)

router.delete('', odontogramaController.eliminar)

router.get('', odontogramaController.verPorUsuario)

module.exports = router;