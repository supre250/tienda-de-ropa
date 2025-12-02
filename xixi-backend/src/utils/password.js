// ------------------------------------------------------
// Funciones helper para encriptar y comparar contraseñas
// usando bcrypt.
// ------------------------------------------------------
const bcrypt = require('bcrypt');

// Número de rondas para generar el salt
const SALT_ROUNDS = 10;

// Encripta una contraseña en texto plano
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
};

// Compara una contraseña en texto plano con el hash guardado
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
