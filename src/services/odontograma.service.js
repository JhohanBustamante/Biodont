const prisma = require("../config/prisma");
const odontogramaService = {};

odontogramaService.verTodos = async (queries) => {

    return await prisma.odontograma.findMany({
        where,
        orderBy: [{}]
    })
}

odontogramaService.crear = async () => {

}

odontogramaService.actualizar = async () => {
    
}

odontogramaService.eliminar = async () => {
    
}

odontogramaService.verPorUsuario = async () => {
    
}

module.exports = odontogramaService;