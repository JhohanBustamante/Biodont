const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { exportar } = require('../controllers/exportar.controller');

router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.post('/', exportar);

module.exports = router;
