const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, documento, nota } = req.body;
        console.log(req.body);
        if(!nombre || !apellido || !documento) 
            return res.status(400).json({
                error: 'Datos incompletos, revisar solicitud.'
            })

        const paciente = await prisma.paciente.create({
            data: {
                nombre, apellido, documento, nota
            }
        });

        res.status(201).json(paciente);
    } catch (error) {
        if(error.code === 'P2002')
            return res.status(409).json({
                error:'El documento ya está vinculado a un paciente.'
        })
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor al crear paciente, error 500' })
    }
}) 

router.get('/', async (req,res)=>{
    try {
        const pacientes = await prisma.paciente.findMany({
            where: { activo:true },
            orderBy: { createdAt: 'desc'}
        })
        res.json(pacientes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor al listar pacientes, error 500' })
    }
})

router.get('/:id', async (req,res)=>{
    try {
        let id = Number(req.params.id);
        if(isNaN(id)) return res.status(400).json({error: 'No se envió un id valido.'})
        const paciente = await prisma.paciente.findFirst({
            where: {
                id,
                activo: true
            }
        })
        if(!paciente) return res.status(404).json({error:'Paciente no encontrado.'})
        res.json(paciente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor al buscar paciente, error 500.' })
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        let id = Number(req.params.id);
        if(isNaN(id)) return res.status(400).json({ error: 'No se envió un id valido.' })
        const paciente = await prisma.paciente.update({
            where: { id },
            data: { activo: false }
        })
        if(!paciente) return res.status(404).json({ error:'Paciente no encontrado.' })
        res.json({ documento: paciente.documento, message:'Paciente desactivado.'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar paciente, error 500.' })
    }
})

router.put('/activar/:id', async (req,res)=>{
    try {
        let id = Number(req.params.id);
        if(isNaN(id)) return res.status(400).json({error: 'No se envió un id valido.'})
        const paciente = await prisma.paciente.update({
            where: { id },
            data: { activo:true }
        })
        if(!paciente) return res.status(404).json({ error:'Paciente no encontrado.' });
        res.json({ paciente:paciente.documento, message: 'Paciente nuevamente activo' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar paciente, error 500.' });
    }
})

module.exports = router;