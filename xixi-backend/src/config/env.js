// ------------------------------------------------------
// Carga las variables de entorno desde el archivo .env
// y expone un objeto "config" con las más importantes.
// ------------------------------------------------------
const dotenv = require('dotenv');

// Cargar variables desde .env
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  
  // SQL Server Configuration
  mssql: {
    server: process.env.MSSQL_SERVER || 'localhost\\SQLEXPRESS',
    database: process.env.MSSQL_DATABASE || 'DBConcecionaria',
    authentication: {
      type: 'default',
      options: {
        userName: process.env.MSSQL_USER || 'sa',
        password: process.env.MSSQL_PASSWORD || '',
      },
    },
    options: {
      encrypt: process.env.MSSQL_ENCRYPT === 'true' || true,
      trustServerCertificate: process.env.MSSQL_TRUST_CERTIFICATE === 'true' || true,
      rowCollectionOnRequestCompletion: true,
    },
  },
  
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = { config };
