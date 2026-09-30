'use strict';
const db = require('./db');

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS productos (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(120)  NOT NULL,
  sku        VARCHAR(60)   NOT NULL UNIQUE,
  precio     NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  stock      INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria  VARCHAR(80),
  creado_en  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

INSERT INTO productos (nombre, sku, precio, stock, categoria) VALUES
  ('Arroz Grado 1 1kg', 'ARR-001', 1290, 40, 'Abarrotes'),
  ('Aceite Vegetal 1L', 'ACE-010', 2490, 15, 'Abarrotes'),
  ('Bebida Cola 1.5L',  'BEB-021', 1690, 60, 'Bebidas'),
  ('Detergente 1kg',    'LIM-005', 3290,  8, 'Limpieza')
ON CONFLICT (sku) DO NOTHING;
`;

async function initDb() {
  try {
    await db.query(SCHEMA_SQL);
    console.log('Base de datos inicializada: tabla "productos" lista.');
  } catch (err) {
    console.error('No se pudo inicializar la base de datos:', err.message);
  }
}

module.exports = { initDb };
