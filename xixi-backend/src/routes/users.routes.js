// ------------------------------------------------------
// Rutas para gestión de usuarios (solo ADMIN).
// Base: /api/users
// ------------------------------------------------------
const express = require('express');
const { body, param, query } = require('express-validator');

const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');

const router = express.Router();

// Todas las rutas de este archivo requieren AUTH + ADMIN
router.use(authMiddleware, adminMiddleware);

// GET /api/users
// Listar usuarios con filtros opcionales
router.get(
  '/',
  [
    query('role')
      .optional()
      .isIn(['ADMIN', 'CUSTOMER'])
      .withMessage('role debe ser ADMIN o CUSTOMER'),
    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive debe ser booleano'),
    query('search').optional().isString(),
  ],
  validateRequest,
  listUsers
);

// GET /api/users/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('ID de usuario inválido')],
  validateRequest,
  getUserById
);

// POST /api/users
// Crear usuario (por admin)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role')
      .optional()
      .isIn(['ADMIN', 'CUSTOMER'])
      .withMessage('El rol debe ser ADMIN o CUSTOMER'),
  ],
  validateRequest,
  createUser
);

// PUT /api/users/:id
// Actualizar usuario
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID de usuario inválido'),
    body('name').optional().notEmpty().withMessage('El nombre no puede ser vacío'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Debe ser un email válido'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role')
      .optional()
      .isIn(['ADMIN', 'CUSTOMER'])
      .withMessage('El rol debe ser ADMIN o CUSTOMER'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive debe ser booleano'),
  ],
  validateRequest,
  updateUser
);

// DELETE /api/users/:id
// Desactivar usuario
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('ID de usuario inválido')],
  validateRequest,
  deleteUser
);

module.exports = router;
