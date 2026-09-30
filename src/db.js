'use strict';

const { Pool } = require('pg');
const config = require('./config');

// Construye la configuración de conexión priorizando DATABASE_URL
// (formato usado por los proveedores Cloud como Render), y cayendo
// a variables individuales para el entorno local con docker-compose.
function buildPoolConfig() {
  if (config.databaseUrl) {
    return {
      connectionString: config.databaseUrl,
      // En producción los proveedores gestionados exigen SSL.
      ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
  return {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  };
}

const pool = new Pool(buildPoolConfig());

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
