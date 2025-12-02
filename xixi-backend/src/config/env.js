// ------------------------------------------------------
// Carga las variables de entorno desde el archivo .env
// y expone un objeto "config" con las más importantes.
// ------------------------------------------------------
const dotenv = require('dotenv');

// Cargar variables desde .env
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/xixi_db',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = { config };
