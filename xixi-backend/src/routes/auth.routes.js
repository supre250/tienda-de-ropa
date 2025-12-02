// ------------------------------------------------------
// Rutas de autenticación: login, registro, perfil.
// ------------------------------------------------------
const express = require('express');
const { body } = require('express-validator');

const { register, login, getProfile } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Registro
router.post(
  '/register',
  [
    // Validaciones básicas
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
);

// Perfil del usuario autenticado
router.get('/me', authMiddleware, getProfile);

module.exports = router;
