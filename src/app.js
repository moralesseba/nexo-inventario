'use strict';

// Módulo principal de la aplicación Express. Define los endpoints y el middleware.
const express = require('express');
const path = require('path');
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

// Métricas en JSON (las consume el dashboard de monitoreo).
app.get('/metrics.json', (req, res) => {
  res.json(
    Object.assign(
      { status: 'ok', service: 'nexo-inventario', version: config.version },
      metrics.snapshot()
    )
  );
});

// Dashboard de monitoreo (página estática servida por la propia app).
app.get('/dashboard', (req, res) => {
  // CSP acotada para que el dashboard cargue sus estilos/scripts propios
  // y consulte los endpoints del mismo origen.
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'"
  );
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/', (req, res) => {
  res.json({
    servicio: 'NEXO — Módulo de gestión de inventario',
    version: config.version,
    endpoints: ['/health', '/metrics', '/metrics.json', '/dashboard', '/api/productos'],
  });
});

app.use('/api/productos', productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
