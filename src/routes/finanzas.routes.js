const express = require("express");
const router = express.Router();
const finanzasController = require("../controllers/finanzas.controller");


router.post("/", finanzasController.crear)


module.exports = router;