'use strict';

// Middleware centralizado de manejo de errores.
// Evita filtrar detalles internos y entrega respuestas JSON consistentes.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = {
    error: err.publicMessage || 'Error interno del servidor',
  };
  if (process.env.NODE_ENV !== 'production') {
    payload.detalle = err.message;
  }
  if (status >= 500) {
    // Registro para observabilidad; en producción iría a un sistema de logs.
    // eslint-disable-next-line no-console
    console.error('[error]', err.message);
  }
  res.status(status).json(payload);
}

function notFound(req, res) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

module.exports = { errorHandler, notFound };
