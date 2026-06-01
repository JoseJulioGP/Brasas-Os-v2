const express = require('express');
const router = express.Router();
const productosController = require('./productos.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// Rutas específicas ANTES de /:id para que no sean capturadas como parámetro
router.get('/costos',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.getProductosConCostos);
router.get('/categorias', verifyToken, productosController.getCategorias);

// Catálogo
router.get('/',     verifyToken, productosController.getProductos);
router.get('/:id',  verifyToken, productosController.getProductoById);

// Solo ADMIN puede crear, editar, eliminar
router.post('/',    verifyToken, requireRole('ADMIN'), productosController.createProducto);
router.put('/:id',  verifyToken, requireRole('ADMIN'), productosController.updateProducto);
router.delete('/:id', verifyToken, requireRole('ADMIN'), productosController.deleteProducto);

module.exports = router;
