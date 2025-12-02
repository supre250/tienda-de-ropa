// ------------------------------------------------------
// Rutas para manejar el carrito del usuario.
// Todas requieren authMiddleware.
// ------------------------------------------------------
const express = require('express');
const { body } = require('express-validator');

const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Obtener carrito del usuario actual
router.get('/', authMiddleware, getCart);

// Agregar producto al carrito
router.post(
  '/items',
  authMiddleware,
  [
    body('productId').notEmpty().withMessage('El productId es obligatorio'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser al menos 1'),
  ],
  addItem
);

// Actualizar cantidad de un producto
router.put(
  '/items/:productId',
  authMiddleware,
  [
    body('quantity')
      .isInt()
      .withMessage('La cantidad debe ser un número entero'),
  ],
  updateItem
);

// Eliminar un producto del carrito
router.delete('/items/:productId', authMiddleware, removeItem);

// Vaciar carrito
router.delete('/', authMiddleware, clearCart);

module.exports = router;
