// ------------------------------------------------------
// Middleware para manejar errores de validación
// de express-validator en un solo lugar.
// 
// Uso en rutas:
//   router.post(
//     '/',
//     [ body('email').isEmail() ],
//     validateRequest,
//     controllerFunc
//   );
// ------------------------------------------------------
const { validationResult } = require('express-validator');
const { ApiError } = require('./error.middleware');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Generamos un mensaje legible con todos los errores
    const messages = errors
      .array()
      .map((err) => `${err.param}: ${err.msg}`)
      .join(', ');

    throw new ApiError(400, `Errores de validación: ${messages}`);
  }

  next();
};

module.exports = {
  validateRequest,
};
