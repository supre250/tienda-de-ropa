// ------------------------------------------------------
// Controlador para CRUD de productos.
// - Crear / actualizar / eliminar → ADMIN
// - Listar productos (público)
// - Filtrar por categoría
// - Buscar por nombre
// ------------------------------------------------------
const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { ApiError } = require('../middlewares/error.middleware');

// POST /api/products
// Crear producto (ADMIN)
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Datos inválidos para crear producto');
    }

    const { name, description, price, images, category, sizes, stock } = req.body;

    // Verificar que la categoría exista
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(400, 'La categoría especificada no existe');
    }

    const product = new Product({
      name,
      description,
      price,
      images: images || [],
      category,
      sizes: sizes || [],
      stock: stock || 0,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products
// Listar productos (público) con filtros básicos
// ?category=ID   → filtra por categoría
// ?search=texto  → busca por nombre
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      // Búsqueda por nombre (case-insensitive)
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
// Obtener un producto por id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category', 'name');
    if (!product || !product.isActive) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
// Actualizar producto (ADMIN)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, category, sizes, stock, isActive } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (images !== undefined) product.images = images;
    if (sizes !== undefined) product.sizes = sizes;
    if (stock !== undefined) product.stock = stock;

    if (category !== undefined) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw new ApiError(400, 'La nueva categoría especificada no existe');
      }
      product.category = category;
    }

    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
// Eliminar producto (suavizado: solo desactivar) (ADMIN)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Producto desactivado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
