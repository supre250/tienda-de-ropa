// ------------------------------------------------------
// Rutas para órdenes (pedidos).
// ------------------------------------------------------
const express = require('express');
const { body } = require('express-validator');

const {
  createOrderFromCart,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/order.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');

const router = express.Router();

// Crear orden a partir del carrito del usuario
router.post(
  '/checkout',
  authMiddleware,
  [
    // Validaciones básicas opcionales
    body('shippingAddress').optional().isObject(),
    body('paymentMethod').optional().isString(),
  ],
  createOrderFromCart
);

// Listar órdenes del usuario autenticado
router.get('/my', authMiddleware, getMyOrders);

// Obtener una orden por id (usuario dueño o admin)
router.get('/:id', authMiddleware, getOrderById);

// Listar todas las órdenes (ADMIN)
router.get('/', authMiddleware, adminMiddleware, getAllOrders);

// Actualizar estado de una orden (ADMIN)
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
