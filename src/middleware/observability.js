'use strict';

const logger = require('../logger');
const metrics = require('../metrics');

// Middleware de observabilidad: registra cada solicitud (logging estructurado)
// y alimenta las métricas usadas para el monitoreo.
function observability(req, res, next) {
  const startNs = process.hrtime.bigint();
  res.on('finish', () => {
    const latencyMs = Number(process.hrtime.bigint() - startNs) / 1e6;
    metrics.record(res.statusCode, latencyMs);
    const level = res.statusCode >= 500 ? 'error' : 'info';
    logger[level]('http_request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      latency_ms: Math.round(latencyMs),
    });
  });
  next();
}

module.exports = { observability };
