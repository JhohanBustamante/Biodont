const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

// Derivar la ruta real del archivo SQLite desde DATABASE_URL
// Soporta rutas absolutas (file:/ruta/absoluta) y relativas (file:./dev.db)
function resolveDbPath() {
  const url = process.env.DATABASE_URL || '';
  const filePart = url.startsWith('file:') ? url.slice(5) : url;
  if (!filePart) return path.resolve(__dirname, '../../prisma/dev.db');
  if (path.isAbsolute(filePart)) return filePart;
  return path.resolve(process.cwd(), filePart);
}
const DB_PATH = resolveDbPath();

const restoreUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB máx
  fileFilter: (_req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.db')) {
      cb(null, true);
    } else {
      const err = new Error('Solo se aceptan archivos .db');
      err.statusCode = 400;
      cb(err);
    }
  },
});

/**
 * GET /admin/backup
 * Descarga el archivo SQLite como copia de seguridad (solo ADMIN).
 */
router.get('/backup', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ ok: false, message: 'Archivo de base de datos no encontrado' });
  }
  try {
    // Forzar checkpoint del WAL para que el archivo .db refleje el estado completo
    await prisma.$executeRawUnsafe('PRAGMA wal_checkpoint(FULL);');
  } catch (_) { /* continuar aunque falle el checkpoint */ }
  const fecha = new Date().toISOString().substring(0, 10);
  res.setHeader('Content-Disposition', `attachment; filename="biodont_backup_${fecha}.db"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.sendFile(DB_PATH);
});

/**
 * POST /admin/restore
 * Reemplaza la base de datos con el archivo subido (solo ADMIN).
 * Flujo: desconectar Prisma → escribir archivo → limpiar WAL/SHM → Prisma reconecta solo.
 */
router.post(
  '/restore',
  authMiddleware,
  roleMiddleware('ADMIN'),
  restoreUpload.single('backup'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'No se recibió ningún archivo' });
    }

    // Validar magic bytes de SQLite ("SQLite format 3\0")
    const magic = req.file.buffer.slice(0, 16).toString('latin1');
    if (!magic.startsWith('SQLite format 3')) {
      return res.status(400).json({ ok: false, message: 'El archivo no es una base de datos SQLite válida' });
    }

    try {
      await prisma.$disconnect();

      fs.writeFileSync(DB_PATH, req.file.buffer);

      // Eliminar archivos WAL y SHM del estado anterior
      for (const ext of ['-wal', '-shm']) {
        const f = DB_PATH + ext;
        if (fs.existsSync(f)) fs.unlinkSync(f);
      }

      // Reconectar explícitamente y verificar que la BD restaurada responde
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;

      return res.json({ ok: true, message: 'Base de datos restaurada correctamente' });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error al restaurar: ' + (err.message || 'error desconocido'),
      });
    }
  },
);

module.exports = router;
