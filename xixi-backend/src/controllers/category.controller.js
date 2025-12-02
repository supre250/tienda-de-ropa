// ------------------------------------------------------
// Controlador para CRUD de categorías.
// - Crear categoría (ADMIN)
// - Listar categorías (público)
// - Actualizar / eliminar (ADMIN)
// ------------------------------------------------------
const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const { ApiError } = require('../middlewares/error.middleware');

// POST /api/categories
// Crear nueva categoría (ADMIN)
const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Datos inválidos para crear categoría');
    }

    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      throw new ApiError(400, 'Ya existe una categoría con ese nombre');
    }

    const category = new Category({
      name,
      description,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories
// Listar todas las categorías activas (público)
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id
// Obtener una categoría por id
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Categoría no encontrada');
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id
// Actualizar categoría (ADMIN)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Categoría no encontrada');
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
// Eliminar categoría (suavizado: solo desactivar) (ADMIN)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Categoría no encontrada');
    }

    // En lugar de borrarla físicamente, la desactivamos
    category.isActive = false;
    await category.save();

    res.json({
      success: true,
      message: 'Categoría desactivada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
