const odontogramaService = require("../services/odontograma.service");
const odontogramaController = {};

odontogramaController.verTodos = async (req, res) => {
  try {
    const odontogramas = await odontogramaService.verTodos(req.query);
    res.json(odontogramas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

odontogramaController.crear = async (req, res) => {
  try {
    const odontograma = await odontogramaService.crear(req.body);
    res.status(201).json(odontograma);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

odontogramaController.versionar = async (req, res) => {
  try {
    console.log("Versionando odontograma");
    console.log(req.body);
    const id = Number(req.params.id);
    const result = await odontogramaService.versionar(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

odontogramaController.verPorUsuario = async (req, res) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
  
    const result = await odontogramaService.verPorUsuario(pacienteId);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

odontogramaController.verHistorial = async (req, res) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const result = await odontogramaService.verHistorial(pacienteId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = odontogramaController;