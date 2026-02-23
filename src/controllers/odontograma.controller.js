const odontogramaService = require("../services/odontograma.service")
const odontogramaController = {}

odontogramaController.verTodos = async (req, res) => {
    try {
        const odontograma = await odontogramaService.verTodos(req.query)
    } catch (error) {
        console.log(error)
        if(error.isOperational)
            return res.status(error.statusCode).json({message: error.message})
    }
}

odontogramaController.crear = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

odontogramaController.eliminar = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

odontogramaController.actualizar = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

odontogramaController.verPorUsuario = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

odontogramaController.verTodos = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = odontogramaController;