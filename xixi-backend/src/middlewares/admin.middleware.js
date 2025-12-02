// ------------------------------------------------------
// Middleware para verificar que el usuario tenga rol ADMIN.
// Debe usarse después de authMiddleware (que llena req.user).
// ------------------------------------------------------
const { ApiError } = require('./error.middleware');

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Acceso denegado: se requiere rol ADMIN');
  }

  next();
};

module.exports = {
  adminMiddleware,
};
