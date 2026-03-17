const express = require("express");
const router = express.Router();
const pacientesController = require("../controllers/pacientes.controller")

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

router.post("/", pacientesController.crear);

router.get("/", pacientesController.verTodos)

router.get("/:id", pacientesController.verPorId)

router.delete("/:id", pacientesController.eliminar)

router.put("/activar/:id", pacientesController.activar)

router.get("/documento/:documento", pacientesController.verPorDocumento)

router.put("/actualizar/:id", pacientesController.actualizar)

module.exports = router;