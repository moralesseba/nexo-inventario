'use strict';

const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `NEXO inventario v${config.version} escuchando en el puerto ${config.port} (${config.env})`
  );
});

// Apagado ordenado (graceful shutdown) para entornos de contenedores.
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => process.exit(0));
});

module.exports = server;
