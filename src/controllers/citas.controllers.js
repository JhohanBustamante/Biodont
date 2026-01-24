const citasService = require("../services/citas.service");
const citasController = {};

citasController.crear = async (req, res) => {
  try {
    const cita = await citasService.crear(req.body);
    res.status(201).json(cita);
  } catch (error) {
    console.error(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

citasController.verCita = async (req, res) => {
  try {
    const pacienteId = Number(req.params.id);
    const estado = req.params.estado.toUpperCase();
    let citas;
    if (!estado || estado === ":ESTADO") {
      citas = await citasService.verPorPaciente({ pacienteId });
    } else {
      citas = await citasService.verPorPacienteYEstado({ pacienteId, estado });
    }
    res.status(200).json(citas);
  } catch (error) {
    console.log(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res
      .status(500)
      .json({ message: "Error interno en el servidor al crear la cita." });
  }
};

citasController.actualizarCita = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const estado = req.params.estado.toUpperCase();
    const citas = await citasService.actualizarEstado({ id, estado });
    res.status(200).json(citas);

  } catch (error) {
    console.log(error);
    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });
    res
      .status(500)
      .json({ message: "Error interno en el servidor al crear la cita." });
  }
};

module.exports = citasController;
