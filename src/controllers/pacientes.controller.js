const citasService = require("../services/citas.service");
const pacientesService = require("../services/pacientes.service");
const pacientesController = {};

pacientesController.crear = async (req, res) => {
  try {
    const paciente = await citasService.crear(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    console.error(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

pacientesController.verTodos = async (req, res) => {
  try {
    const pacientes = await pacientesService.verTodos();
    res.status(200).json(pacientes);
  } catch (error) {
    console.log(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res.status(500).json({
      message: "Error interno en el servidor al ver los pacientes activos.",
    });
  }
};

pacientesController.verPorId = async (req, res) => {
  try {
    const id = Number(req.params.id.trim());
    const pacientes = await pacientesService.verPorId({ id });
    res.status(200).json(pacientes);
  } catch (error) {
    console.log(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res
      .status(500)
      .json({ message: "Error interno en el servidor al ver el paciente." });
  }
};

pacientesController.eliminar = async (req, res) => {
  try {
    const id = Number(req.params.id.trim());
    const paciente = pacientesService.eliminar({ id });
    res.status(200).json({ message: "Usuario desactivado con éxito." });
  } catch (error) {
    console.log(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res
      .status(500)
      .json({ message: "Error interno en el servidor al ver el paciente." });
  }
};

pacientesController.activar = async (req, res) => {
  try {
    const id = Number(req.params.id.trim());
    const paciente = pacientesService.activar({ id });
    res.status(200).json({ message: "Usuario activado con éxito." });
  } catch (error) {
    console.log(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res
      .status(500)
      .json({ message: "Error interno en el servidor al ver el paciente." });
  }
};

pacientesController.verPorDocumento = async (req, res) => {
  try {
    const documento = req.params.documento.trim();
    console.log(documento);
    const paciente = await pacientesService.verPorDocumento({ documento });
    res.status(200).json(paciente);
  } catch (error) {
    console.log(error);

    if (error.isOperational)
      return res.status(error.statusCode).json({ message: error.message });

    res
      .status(500)
      .json({ message: "Error interno en el servidor al ver el paciente." });
  }
};

module.exports = pacientesController;
