const express = require("express");
const prisma = require("../config/prisma");
const router = express.Router();
const pacientesController = require("../controllers/pacientes.controller")

router.post("/", pacientesController.crear);

router.get("/", pacientesController.verTodos)

router.get("/:id", pacientesController.verPorId)

router.delete("/:id", pacientesController.eliminar)

router.put("/activar/:id", pacientesController.activar)

router.get("/documento/:documento", pacientesController.verPorDocumento)

// router.get("/:id", async (req, res) => {
//   try {
//     let id = Number(req.params.id);
//     if (isNaN(id))
//       return res.status(400).json({ error: "No se envió un id valido." });
//     const paciente = await prisma.paciente.findFirst({
//       where: {
//         id,
//         activo: true,
//       },
//     });
//     if (!paciente)
//       return res.status(404).json({ error: "Paciente no encontrado." });
//     res.json(paciente);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({
//         error: "Error interno del servidor al buscar paciente, error 500.",
//       });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     let id = Number(req.params.id);
//     if (isNaN(id))
//       return res.status(400).json({ error: "No se envió un id valido." });
//     const paciente = await prisma.paciente.update({
//       where: { id },
//       data: { activo: false },
//     });
//     if (!paciente)
//       return res.status(404).json({ error: "Paciente no encontrado." });
//     res.json({
//       documento: paciente.documento,
//       message: "Paciente desactivado.",
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({
//         error: "Error interno del servidor al eliminar paciente, error 500.",
//       });
//   }
// });

// router.put("/activar/:id", async (req, res) => {
//   try {
//     let id = Number(req.params.id);
//     if (isNaN(id))
//       return res.status(400).json({ error: "No se envió un id valido." });
//     const paciente = await prisma.paciente.update({
//       where: { id },
//       data: { activo: true },
//     });
//     if (!paciente)
//       return res.status(404).json({ error: "Paciente no encontrado." });
//     res.json({
//       paciente: paciente.documento,
//       message: "Paciente nuevamente activo",
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({
//         error: "Error interno del servidor al actualizar paciente, error 500.",
//       });
//   }
// });

module.exports = router;