// ------------------------------------------------------
// Rutas para manejar productos.
// ------------------------------------------------------
const express = require('express');
const { body } = require('express-validator');

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');

const router = express.Router();

// Listar productos (público) con filtros ?category=&search=
router.get('/', getProducts);

// Obtener producto por id
router.get('/:id', getProductById);

// Crear producto (ADMIN)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('price').isNumeric().withMessage('El precio debe ser numérico'),
    body('category').notEmpty().withMessage('La categoría es obligatoria'),
    body('images').optional().isArray(),
    body('sizes').optional().isArray(),
    body('stock').optional().isNumeric(),
  ],
  createProduct
);

// Actualizar producto (ADMIN)
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('name').optional().notEmpty(),
    body('price').optional().isNumeric(),
    body('category').optional().notEmpty(),
    body('images').optional().isArray(),
    body('sizes').optional().isArray(),
    body('stock').optional().isNumeric(),
    body('isActive').optional().isBoolean(),
  ],
  updateProduct
);

// "Eliminar" producto (desactivar) (ADMIN)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
