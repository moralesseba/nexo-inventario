'use strict';

const db = require('../db');

// Validación simple y explícita de un producto (sin dependencias externas).
function validarProducto(body, { parcial = false } = {}) {
  const errores = [];
  const { nombre, sku, precio, stock, categoria } = body;

  if (!parcial || nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim().length < 2) {
      errores.push('nombre es obligatorio (mínimo 2 caracteres)');
    }
  }
  if (!parcial || sku !== undefined) {
    if (typeof sku !== 'string' || sku.trim().length < 1) {
      errores.push('sku es obligatorio');
    }
  }
  if (!parcial || precio !== undefined) {
    if (typeof precio !== 'number' || Number.isNaN(precio) || precio < 0) {
      errores.push('precio debe ser un número mayor o igual a 0');
    }
  }
  if (!parcial || stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0) {
      errores.push('stock debe ser un entero mayor o igual a 0');
    }
  }
  if (categoria !== undefined && typeof categoria !== 'string') {
    errores.push('categoria debe ser texto');
  }
  return errores;
}

async function listarProductos(req, res, next) {
  try {
    const { rows } = await db.query(
      'SELECT id, nombre, sku, precio, stock, categoria, creado_en FROM productos ORDER BY id ASC'
    );
    res.json({ data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
}

// Productos con stock menor o igual al umbral (apoya la reposición del almacén).
async function productosBajoStock(req, res, next) {
  try {
    const umbral = parseInt(req.query.umbral, 10) || 10;
    const { rows } = await db.query(
      'SELECT id, nombre, sku, precio, stock, categoria FROM productos WHERE stock <= $1 ORDER BY stock ASC',
      [umbral]
    );
    res.json({ data: rows, total: rows.length, umbral });
  } catch (err) {
    next(err);
  }
}

async function obtenerProducto(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT id, nombre, sku, precio, stock, categoria, creado_en FROM productos WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function crearProducto(req, res, next) {
  try {
    const errores = validarProducto(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', errores });
    }
    const { nombre, sku, precio, stock, categoria } = req.body;
    const { rows } = await db.query(
      `INSERT INTO productos (nombre, sku, precio, stock, categoria)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, sku, precio, stock, categoria, creado_en`,
      [nombre.trim(), sku.trim(), precio, stock, categoria || null]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El SKU ya existe' });
    }
    next(err);
  }
}

async function actualizarProducto(req, res, next) {
  try {
    const { id } = req.params;
    const errores = validarProducto(req.body, { parcial: true });
    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', errores });
    }
    const campos = ['nombre', 'sku', 'precio', 'stock', 'categoria'];
    const sets = [];
    const valores = [];
    let i = 1;
    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        sets.push(`${campo} = $${i}`);
        valores.push(req.body[campo]);
        i += 1;
      }
    }
    if (sets.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    valores.push(id);
    const { rows } = await db.query(
      `UPDATE productos SET ${sets.join(', ')} WHERE id = $${i}
       RETURNING id, nombre, sku, precio, stock, categoria, creado_en`,
      valores
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function eliminarProducto(req, res, next) {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM productos WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listarProductos,
  productosBajoStock,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  validarProducto,
};
