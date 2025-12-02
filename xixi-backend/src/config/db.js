// ------------------------------------------------------
// Configura la conexión a MongoDB usando Mongoose.
// ------------------------------------------------------
const mongoose = require('mongoose');
const { config } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Conectado a MongoDB:', config.mongoUri);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1); // Cerrar el proceso si falla la conexión
  }
};

module.exports = { connectDB };
