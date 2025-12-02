// ------------------------------------------------------
// Manejo global de errores para la API.
// Cualquier error lanzado en controladores pasa por aquí.
// ------------------------------------------------------

// Clase de error personalizada para API
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode || 500;
  }
}

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  ApiError,
  errorHandler,
};
