'use strict';

// Módulo principal de la aplicación Express. Define los endpoints y el middleware.
const express = require('express');
const config = require('./config');
const productosRoutes = require('./routes/productos.routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/security');
const { observability } = require('./middleware/observability');
const metrics = require('./metrics');

const app = express();

// Seguridad: no revelar la tecnología del servidor (cabecera X-Powered-By).
app.disable('x-powered-by');

app.use(securityHeaders); // encabezados de seguridad (DevSecOps)
app.use(observability);   // logging estructurado + métricas (monitoreo)
app.use(express.json());

// Endpoint de salud (health check) usado por el contenedor, el pipeline
// y el proveedor Cloud para verificar que la aplicación está en ejecución.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nexo-inventario', version: config.version });
});

// Endpoint de métricas para monitoreo (formato de texto estilo Prometheus).
app.get('/metrics', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(metrics.prometheus());
});

app.get('/', (req, res) => {
  res.json({
    servicio: 'NEXO — Módulo de gestión de inventario',
    version: config.version,
    endpoints: ['/health', '/metrics', '/api/productos'],
  });
});

app.use('/api/productos', productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
