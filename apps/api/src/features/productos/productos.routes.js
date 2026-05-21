const express = require('express');
const router = express.Router();
const productosController = require('./productos.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// Ruta específica ANTES de /:id para que no sea capturada como parámetro
router.get('/costos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.getProductosConCostos);

// Catálogo - requiere auth para filtrar campos sensibles según rol (T-19)
router.get('/', verifyToken, productosController.getProductos);
router.get('/:id', verifyToken, productosController.getProductoById);

// Solo Admin puede crear, editar, eliminar (T-12)
router.post('/', verifyToken, requireRole('ADMIN'), productosController.createProducto);
router.put('/:id', verifyToken, requireRole('ADMIN'), productosController.updateProducto);
router.delete('/:id', verifyToken, requireRole('ADMIN'), productosController.deleteProducto);

module.exports = router;