const express = require("express");
const prisma = require("../config/prisma");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fecha, motivo, observaciones, pacienteId } = req.body;
    console.log(req.body);
    if (!pacienteId || !motivo || !fecha)
      return res
        .status(400)
        .json({ error: "Datos faltantes para crear la cita" });
    const cita = await prisma.cita.create({
      data: {
        fecha: new Date(fecha),
        motivo,
        observaciones,
        pacienteId,
      },
    });
    res.status(201).json(cita);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor al crear la cita." });
  }
});

router.get("/paciente/:id/:estado", async (req, res) => {
  try {
    console.log(req.params);
    const pacienteId = Number(req.params.id);
    let estado = req.params.estado.toUpperCase();
    if (
      estado == "" ||
      estado == undefined ||
      estado == null ||
      estado == ":ESTADO"
    ) {
      const cita = await prisma.cita.findMany({
        where: { pacienteId },
        orderBy: { fecha: "asc" },
      });
        res.status(201).json(cita);
    }
    if (
      estado == "PROGRAMADA" ||
      estado == "CANCELADA" ||
      estado == "ATENDIDA"
    ) {
      const cita = await prisma.cita.findMany({
        where: { pacienteId, estado },
        orderBy: { fecha: "asc" },
      });
        res.status(201).json(cita);
    } else {
      return res.status(400).json({
        message:
          "Estado no válido. Solo se acepta cita programada, cancelada o atendida",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor al crear la cita." });
  }
});

module.exports = router;
