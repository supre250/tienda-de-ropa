// ------------------------------------------------------
// Lógica de carrito de compras.
// Todas las rutas de carrito requieren que el usuario
// esté autenticado (authMiddleware).
//
// Funciones:
// - getCart: obtener carrito del usuario
// - addItem: agregar producto al carrito
// - updateItem: actualizar cantidad de un producto
// - removeItem: eliminar un producto del carrito
// - clearCart: vaciar carrito
// ------------------------------------------------------
const { validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ApiError } = require('../middlewares/error.middleware');

// Helper: obtener o crear carrito para un usuario
const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
    cart = await Cart.findOne({ user: userId }).populate('items.product');
  }
  return cart;
};

// GET /api/cart
// Obtener carrito del usuario autenticado
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await findOrCreateCart(userId);

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/items
// Agregar producto al carrito
// body: { productId, quantity }
const addItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Datos inválidos para agregar al carrito');
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Verificar que el producto exista y esté activo
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, 'Producto no encontrado o inactivo');
    }

    let cart = await findOrCreateCart(userId);

    // Buscar si el producto ya está en el carrito
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    cart = await Cart.findOne({ user: userId }).populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Producto agregado al carrito',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/items/:productId
// Actualizar cantidad de un producto en el carrito
// body: { quantity }
const updateItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await findOrCreateCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw new ApiError(404, 'El producto no está en el carrito');
    }

    // Si la cantidad <= 0, lo quitamos del carrito
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    cart = await Cart.findOne({ user: userId }).populate('items.product');

    res.json({
      success: true,
      message: 'Carrito actualizado',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/items/:productId
// Eliminar un producto del carrito
const removeItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await findOrCreateCart(userId);

    const newItems = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.items = newItems;
    await cart.save();
    cart = await Cart.findOne({ user: userId }).populate('items.product');

    res.json({
      success: true,
      message: 'Producto eliminado del carrito',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart
// Vaciar carrito
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.json({
        success: true,
        message: 'El carrito ya está vacío',
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Carrito vaciado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
