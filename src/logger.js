'use strict';

// Logging estructurado en formato JSON (una línea por evento).
// Facilita el monitoreo: en Render los logs quedan en la consola del servicio,
// y una línea JSON es fácil de filtrar, buscar y exportar a una herramienta
// de observabilidad (equivalente a enviar logs a AWS CloudWatch).
const config = require('./config');

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const current = LEVELS[process.env.LOG_LEVEL] !== undefined ? LEVELS[process.env.LOG_LEVEL] : LEVELS.info;

function log(level, message, meta) {
  if (LEVELS[level] > current) return;
  const entry = Object.assign(
    {
      ts: new Date().toISOString(),
      level,
      service: 'nexo-inventario',
      version: config.version,
      message,
    },
    meta || {}
  );
  const line = JSON.stringify(entry);
  // eslint-disable-next-line no-console
  if (level === 'error') console.error(line);
  // eslint-disable-next-line no-console
  else console.log(line);
}

module.exports = {
  error: (m, meta) => log('error', m, meta),
  warn: (m, meta) => log('warn', m, meta),
  info: (m, meta) => log('info', m, meta),
  debug: (m, meta) => log('debug', m, meta),
};
