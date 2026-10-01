'use strict';

// Módulo principal de la aplicación Express. Define los endpoints y el middleware.
const express = require('express');
const config = require('./config');
const productosRoutes = require('./routes/productos.routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// Endpoint de salud (health check) usado por el contenedor, el pipeline
// y el proveedor Cloud para verificar que la aplicación está en ejecución.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nexo-inventario', version: config.version });
});

app.get('/', (req, res) => {
  res.json({
    servicio: 'NEXO — Módulo de gestión de inventario',
    version: config.version,
    endpoints: ['/health', '/api/productos'],
  });
});

app.use('/api/productos', productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
