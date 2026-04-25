const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const DB_PATH = path.resolve(__dirname, '../../prisma/dev.db');

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
router.get('/backup', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ ok: false, message: 'Archivo de base de datos no encontrado' });
  }
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
