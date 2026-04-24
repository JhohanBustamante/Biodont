const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const AppError = require('../errors/AppError');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const getSubfolder = (mimetype) => {
  return mimetype.startsWith('image/') ? 'imagenes' : 'documentos';
};

const getExtension = (mimetype) => {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
  };
  return map[mimetype] || '';
};

const listDocumentosByPacienteService = async (pacienteId) => {
  const paciente = await prisma.paciente.findUnique({
    where: { id: Number(pacienteId) },
  });

  if (!paciente) throw new AppError('Paciente no encontrado', 404);

  return prisma.documento.findMany({
    where: { pacienteId: Number(pacienteId) },
    orderBy: { createdAt: 'desc' },
    include: {
      usuario: {
        select: { id: true, nombre: true, apellido: true, rol: true },
      },
    },
  });
};

const createDocumentoService = async ({ pacienteId, tipo, fecha, file, user }) => {
  if (!file) throw new AppError('Archivo requerido', 400);
  if (!pacienteId) throw new AppError('Paciente requerido', 400);
  if (!tipo) throw new AppError('Tipo de documento requerido', 400);

  const paciente = await prisma.paciente.findUnique({
    where: { id: Number(pacienteId) },
  });
  if (!paciente) throw new AppError('Paciente no encontrado', 404);

  const subfolder = getSubfolder(file.mimetype);
  const ext = getExtension(file.mimetype);
  const nombreArchivo = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const rutaRelativa = path.join('pacientes', String(pacienteId), subfolder, nombreArchivo).replace(/\\/g, '/');
  const rutaAbsoluta = path.join(UPLOADS_DIR, 'pacientes', String(pacienteId), subfolder);

  fs.mkdirSync(rutaAbsoluta, { recursive: true });
  fs.writeFileSync(path.join(rutaAbsoluta, nombreArchivo), file.buffer);

  return prisma.documento.create({
    data: {
      pacienteId: Number(pacienteId),
      usuarioId: user?.id || null,
      nombre: file.originalname,
      nombreArchivo,
      tipo,
      fecha: fecha ? new Date(fecha) : null,
      ruta: rutaRelativa,
      mimetype: file.mimetype,
      tamanio: file.size,
    },
    include: {
      usuario: {
        select: { id: true, nombre: true, apellido: true, rol: true },
      },
    },
  });
};

const getDocumentoArchivoService = async (id) => {
  const documento = await prisma.documento.findUnique({
    where: { id: Number(id) },
  });

  if (!documento) throw new AppError('Documento no encontrado', 404);

  const rutaAbsoluta = path.join(UPLOADS_DIR, documento.ruta);

  if (!fs.existsSync(rutaAbsoluta)) {
    throw new AppError('Archivo no encontrado en disco', 404);
  }

  return { documento, rutaAbsoluta };
};

const deleteDocumentoService = async (id) => {
  const documento = await prisma.documento.findUnique({
    where: { id: Number(id) },
  });

  if (!documento) throw new AppError('Documento no encontrado', 404);

  const rutaAbsoluta = path.join(UPLOADS_DIR, documento.ruta);

  if (fs.existsSync(rutaAbsoluta)) {
    fs.unlinkSync(rutaAbsoluta);
  }

  await prisma.documento.delete({ where: { id: Number(id) } });
};

module.exports = {
  listDocumentosByPacienteService,
  createDocumentoService,
  getDocumentoArchivoService,
  deleteDocumentoService,
};
