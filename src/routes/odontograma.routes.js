const express = require("express");
const odontogramaController = require("../controllers/odontograma.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("", odontogramaController.verTodos);
router.post("", odontogramaController.crear);

router.get("/historial/:pacienteId", odontogramaController.verHistorial);
router.get("/:pacienteId", odontogramaController.verPorUsuario);

router.patch("/:id", odontogramaController.actualizarDientes);
router.put("/:id", odontogramaController.versionar);
//router.delete("/:id", odontogramaController.eliminar);

module.exports = router;