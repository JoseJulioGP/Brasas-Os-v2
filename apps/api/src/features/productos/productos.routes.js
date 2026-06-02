const express = require('express');
const router = express.Router();
const productosController = require('./productos.controller');
const { verifyToken, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// Rutas específicas ANTES de /:id
router.get('/costos',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.getProductosConCostos);
router.get('/categorias', verifyToken, productosController.getCategorias);

// Catálogo
router.get('/',     verifyToken, productosController.getProductos);
router.get('/:id',  verifyToken, productosController.getProductoById);

// JEFE y ADMIN pueden gestionar el menú
router.post('/',    verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.createProducto);
router.put('/:id',  verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.updateProducto);
router.delete('/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.deleteProducto);

module.exports = router;
