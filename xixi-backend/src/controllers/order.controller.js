// ------------------------------------------------------
// Controlador para gestionar órdenes (pedidos).
//
// Funciones principales:
// - createOrderFromCart: crear orden a partir del carrito del usuario
// - getMyOrders: listar órdenes del usuario autenticado
// - getOrderById: ver una orden (usuario dueño o admin)
// - getAllOrders: listar todas las órdenes (ADMIN)
// ------------------------------------------------------
const { validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { ApiError } = require('../middlewares/error.middleware');

// POST /api/orders/checkout
// Crea una orden a partir del carrito actual del usuario
// body: { shippingAddress?, paymentMethod? }
const createOrderFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Datos inválidos para crear la orden');
    }

    // Obtener carrito del usuario
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'El carrito está vacío');
    }

    const { shippingAddress, paymentMethod } = req.body;

    // Construimos los items de la orden con snapshot de nombre y precio
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      // Verificar que el producto siga activo
      if (!product || !product.isActive) {
        throw new ApiError(
          400,
          `El producto "${product?.name || 'desconocido'}" ya no está disponible`
        );
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
      });
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'PENDING',
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'CASH',
    });

    await order.save();

    // Vaciar carrito después de crear la orden
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Orden creada correctamente',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my
// Listar órdenes del usuario autenticado
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name');

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
// Obtener una orden. Solo la puede ver:
// - el propio usuario dueño de la orden
// - un administrador
const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.product', 'name');
    if (!order) {
      throw new ApiError(404, 'Orden no encontrada');
    }

    // Si no es admin, debe ser el dueño de la orden
    if (userRole !== 'ADMIN' && order.user.toString() !== userId) {
      throw new ApiError(403, 'No tienes permiso para ver esta orden');
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
// Listar todas las órdenes (solo ADMIN)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status
// Actualizar estado de la orden (ADMIN)
// body: { status }
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Estado de orden inválido');
    }

    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, 'Orden no encontrada');
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Estado de la orden actualizado',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
