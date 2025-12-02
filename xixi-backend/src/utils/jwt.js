// ------------------------------------------------------
// Funciones helper para crear y verificar JSON Web Tokens
// ------------------------------------------------------
const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

// Crea un token con el payload que le pasemos
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Verifica un token y devuelve el payload si es válido
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};
