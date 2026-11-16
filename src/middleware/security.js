'use strict';

// Encabezados de seguridad HTTP (equivalente ligero a Helmet, sin dependencias).
// Reduce la superficie de ataque del servicio: evita sniffing de tipos,
// clickjacking y fuga de información en la cabecera.
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  next();
}

module.exports = { securityHeaders };
