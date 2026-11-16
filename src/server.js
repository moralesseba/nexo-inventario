'use strict';

const app = require('./app');
const config = require('./config');
const { initDb } = require('./initDb');
const logger = require('./logger');

async function start() {
  // Crea el esquema si no existe (en Render la base de datos parte vacía).
  await initDb();

  const server = app.listen(config.port, () => {
    logger.info('server_started', {
      port: config.port,
      env: config.env,
      version: config.version,
    });
  });

  // Apagado ordenado (graceful shutdown) para entornos de contenedores.
  process.on('SIGTERM', () => {
    logger.info('shutdown', { signal: 'SIGTERM' });
    server.close(() => process.exit(0));
  });

  return server;
}

start();
module.exports = { start };
