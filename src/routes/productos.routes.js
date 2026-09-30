'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/productos.controller');

const router = Router();

// Módulo de gestión de inventario de NEXO — recurso "productos".
router.get('/', ctrl.listarProductos);
router.get('/:id', ctrl.obtenerProducto);
router.post('/', ctrl.crearProducto);
router.put('/:id', ctrl.actualizarProducto);
router.delete('/:id', ctrl.eliminarProducto);

module.exports = router;
