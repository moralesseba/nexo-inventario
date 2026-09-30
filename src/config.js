'use strict';

// Carga variables de entorno desde .env (solo en desarrollo local).
// En la nube y en el pipeline, las variables se inyectan como secretos.
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  // La conexión a la base de datos NUNCA se escribe en el código:
  // se recibe por variable de entorno / secreto de la plataforma.
  databaseUrl: process.env.DATABASE_URL || null,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'nexo',
    password: process.env.DB_PASSWORD || 'nexo',
    database: process.env.DB_NAME || 'nexo_inventario',
  },
  version: require('../package.json').version,
};

module.exports = config;
