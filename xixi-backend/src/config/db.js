// ------------------------------------------------------
// Configura la conexión a SQL Server.
// ------------------------------------------------------
const sql = require('mssql');
const { config } = require('./env');

let pool;

const connectDB = async () => {
  try {
    // Crear la conexión a SQL Server
    pool = new sql.ConnectionPool(config.mssql);
    
    await pool.connect();
    console.log('✅ Conectado a SQL Server:', config.mssql.server, '- Base de datos:', config.mssql.database);
    
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a SQL Server:', error.message);
    process.exit(1);
  }
};

// Obtener el pool de conexiones
const getPool = () => {
  if (!pool) {
    throw new Error('No hay conexión a la base de datos');
  }
  return pool;
};

// Cerrar la conexión
const closeDB = async () => {
  if (pool) {
    await pool.close();
    console.log('Conexión a SQL Server cerrada');
  }
};

module.exports = { connectDB, getPool, closeDB };
