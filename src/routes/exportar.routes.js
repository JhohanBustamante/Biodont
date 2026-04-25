const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { exportar } = require('../controllers/exportar.controller');

router.use(authMiddleware);

router.post('/', exportar);

module.exports = router;
