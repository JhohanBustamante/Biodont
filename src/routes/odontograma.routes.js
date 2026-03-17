const express = require("express");
const odontogramaController = require("../controllers/odontograma.controller");

const router = express.Router();

router.get("", odontogramaController.verTodos);
router.post("", odontogramaController.crear);

router.get("/historial/:pacienteId", odontogramaController.verHistorial);
router.get("/:pacienteId", odontogramaController.verPorUsuario);

router.put("/:id", odontogramaController.versionar);
//router.delete("/:id", odontogramaController.eliminar);

module.exports = router;