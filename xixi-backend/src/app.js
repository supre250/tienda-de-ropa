// ------------------------------------------------------
// Configura la aplicación Express: middlewares globales,
// rutas y manejo de errores.
// ------------------------------------------------------
const express = require('express');
const cors = require('cors');

const { httpLogger } = require('./utils/logger');

// Importar middlewares de errores
const { errorHandler } = require('./middlewares/error.middleware');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
// (luego agregarás aquí products.routes, categories.routes, etc.)
const productsRoutes = require('./routes/products.routes');
const categoriesRoutes = require('./routes/categories.routes');

const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const usersRoutes = require('./routes/users.routes');

const app = express();

// Middlewares globales
app.use(cors()); // Permitir CORS (frontend podrá llamar al backend)
app.use(express.json()); // Parsear JSON en request body
app.use(httpLogger); // Logs HTTP (morgan)

// Rutas base de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

// Ruta simple de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API XI-XI funcionando 🚀' });
});

// Middleware global de manejo de errores
app.use(errorHandler);

module.exports = app;
