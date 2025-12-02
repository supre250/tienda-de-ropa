// ------------------------------------------------------
// Middleware para verificar el token JWT.
// Si es válido, añade req.user con { id, role }.
// ------------------------------------------------------
const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('./error.middleware');

const authMiddleware = (req, res, next) => {
  // Esperamos el token en el header Authorization: Bearer xxx
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'No autorizado: token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    // decoded puede tener { id, role, ... }
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
};

module.exports = {
  authMiddleware,
};
