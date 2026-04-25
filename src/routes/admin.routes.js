const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

/**
 * GET /admin/backup
 * Descarga el archivo SQLite como copia de seguridad.
 * Restringido a ADMIN. El archivo se sirve directamente desde disco.
 * Nota: para bases de datos en producción de alta concurrencia se
 * recomienda usar "VACUUM INTO", pero para uso local es suficiente.
 */
router.get('/backup', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
  const dbPath = path.resolve(__dirname, '../../prisma/dev.db');

  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ ok: false, message: 'Archivo de base de datos no encontrado' });
  }

  const fecha = new Date().toISOString().substring(0, 10);
  const filename = `biodont_backup_${fecha}.db`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.sendFile(dbPath);
});

module.exports = router;
