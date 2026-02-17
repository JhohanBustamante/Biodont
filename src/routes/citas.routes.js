const express = require("express");
const router = express.Router();
const controllerCitas = require('../controllers/citas.controllers')

router.post("/", controllerCitas.crear);

router.get("/paciente/:id/estado/:estado", controllerCitas.verCita);

router.put("/:id/estado/:estado", controllerCitas.actualizarCita);

router.get("/", controllerCitas.verTodos)

module.exports = router;