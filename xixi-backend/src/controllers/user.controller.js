// ------------------------------------------------------
// Controlador para gestionar usuarios.
// Solo debería ser usado por administradores (ADMIN).
//
// Funciones:
// - listUsers: listar usuarios con filtros
// - getUserById: obtener usuario por id
// - createUser: crear usuario (ej. crear otro admin o cliente)
// - updateUser: actualizar datos (nombre, email, rol, estado, password)
// - deleteUser: desactivar usuario (isActive = false)
// ------------------------------------------------------
const User = require('../models/User');
const { ApiError } = require('../middlewares/error.middleware');

// GET /api/users
// Query params opcionales:
//  - role=ADMIN|CUSTOMER
//  - isActive=true|false
//  - search=texto (nombre o email)
const listUsers = async (req, res, next) => {
  try {
    const { role, isActive, search } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      // llega como string "true"/"false"
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password') // no devolvemos hashes de contraseña
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
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

// POST /api/users
// Crear usuario (por admin)
// body: { name, email, password, role }
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(400, 'Ya existe un usuario con ese email');
    }

    const user = new User({
      name,
      email,
      password, // se encripta en el pre('save') del modelo
      role: role || 'CUSTOMER',
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
// Actualizar usuario (por admin)
// body opcional: { name, email, password, role, isActive }
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    // Si cambia el email, verificamos que no exista otro
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        throw new ApiError(400, 'Ya existe otro usuario con ese email');
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;

    // Si viene password, se reasigna y se re-encripta en pre('save')
    if (password) {
      user.password = password;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
// Desactivar usuario (soft delete)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Usuario desactivado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
