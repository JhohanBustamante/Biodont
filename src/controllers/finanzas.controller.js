const finanzasController = {}
const finanzasService = require("../services/finanzas.service")

finanzasController.crear = async (req, res) => {
    try {
        const finanza = await finanzasService.crear(req.body)
        res.status(201).json(finanza)

    } catch (error) {
        console.error(error);
        if (error.isOperational)
            return res.status(error.statusCode).json({ message: error.message });
        res.status(500).json({
            message: "Error interno del servidor",
        });
    }
}

module.exports = finanzasController