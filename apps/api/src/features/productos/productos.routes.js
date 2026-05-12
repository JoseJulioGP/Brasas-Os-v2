const express = require('express');
const router = express.Router();
const productosController = require('./productos.controller');
const { verifyToken, requireRole } = require('../../shared/middlewares/auth.middleware');

// Rutas públicas (para empleados - ver catálogo activo)
router.get('/', productosController.getProductos);
// router.get('/:id', productosController.getProductoById);

// Rutas protegidas (solo Admin)
router.post('/', verifyToken, requireRole('ADMIN'), productosController.createProducto);
router.put('/:id', verifyToken, requireRole('ADMIN'), productosController.updateProducto);
router.delete('/:id', verifyToken, requireRole('ADMIN'), productosController.deleteProducto);

// Rutas para Jefe (ver costos y márgenes)
router.get('/costos', verifyToken, requireRole('JEFE'), productosController.getProductosConCostos);

module.exports = router;