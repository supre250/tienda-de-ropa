// ------------------------------------------------------
// Define un logger sencillo y configura morgan para logs
// HTTP en modo desarrollo.
// ------------------------------------------------------
const morgan = require('morgan');

const httpLogger = morgan('dev');

// Logger simple para usar en cualquier parte
const log = (...args) => {
  console.log('[XI-XI LOG]:', ...args);
};

module.exports = {
  httpLogger,
  log,
};
