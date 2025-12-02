// ------------------------------------------------------
// Controlador de autenticación:
// - Registro de usuario
// - Login
// - Obtener perfil del usuario autenticado
// ------------------------------------------------------
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { ApiError } = require('../middlewares/error.middleware');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    // Validar errores de express-validator (si usas validaciones)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Datos de registro inválidos');
    }

    const { name, email, password } = req.body;

    // ¿Ya existe un usuario con ese email?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'El email ya está registrado');
    }

    // Crear usuario
    const user = new User({
      name,
      email,
      password, // se encripta en el hook pre('save')
      role: 'CUSTOMER',
    });

    await user.save();

    // Crear token
    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, 'Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Cuenta desactivada. Contacte al administrador.');
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(400, 'Credenciales inválidas');
    }

    // Crear token
    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Requiere authMiddleware
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
