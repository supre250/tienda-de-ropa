// ------------------------------------------------------
// Punto de entrada del servidor. Conecta a la base de
// datos y levanta el servidor HTTP.
// ------------------------------------------------------
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();

  server.listen(config.port, () => {
    console.log(`✅ Servidor XI-XI escuchando en http://localhost:${config.port}`);
  });
};

startServer();
