// ------------------------------------------------------
// Rutas para manejar categorías.
// ------------------------------------------------------
const express = require('express');
const { body } = require('express-validator');

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');

const router = express.Router();

// Listar categorías (público)
router.get('/', getCategories);

// Obtener una categoría por id
router.get('/:id', getCategoryById);

// Crear categoría (ADMIN)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('description').optional().isString(),
  ],
  createCategory
);

// Actualizar categoría (ADMIN)
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('name').optional().notEmpty(),
    body('description').optional().isString(),
    body('isActive').optional().isBoolean(),
  ],
  updateCategory
);

// "Eliminar" categoría (desactivar) (ADMIN)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
