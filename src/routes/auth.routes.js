const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  listUsers,
  updateUserRole,
  updateUserStatus,
  getClinicalStaff
} = require('../controllers/auth.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

// Públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Privadas
router.get('/me', authMiddleware, getProfile);

// Solo admin
router.get('/users', authMiddleware, roleMiddleware('ADMIN'), listUsers);
router.patch('/users/:id/role', authMiddleware, roleMiddleware('ADMIN'), updateUserRole);
router.patch('/users/:id/status', authMiddleware, roleMiddleware('ADMIN'), updateUserStatus);
router.get('/clinical-staff', authMiddleware, getClinicalStaff);

module.exports = router;