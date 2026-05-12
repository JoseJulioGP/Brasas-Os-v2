const express = require('express');
const router = express.Router();
const productosController = require('./productos.controller');
const { verifyToken, requireRole } = require('../../shared/middlewares/auth.middleware');

<<<<<<< Updated upstream
// Rutas públicas (para empleados - ver catálogo activo)
router.get('/', productosController.getProductos);
// router.get('/:id', productosController.getProductoById);

// Rutas protegidas (solo Admin)
=======
// Rutas públicas - Empleados pueden ver el catálogo activo
router.get('/', productosController.getProductos);
router.get('/:id', productosController.getProductoById);

// Rutas protegidas - Solo Admin puede crear, editar, eliminar
>>>>>>> Stashed changes
router.post('/', verifyToken, requireRole('ADMIN'), productosController.createProducto);
router.put('/:id', verifyToken, requireRole('ADMIN'), productosController.updateProducto);
router.delete('/:id', verifyToken, requireRole('ADMIN'), productosController.deleteProducto);

<<<<<<< Updated upstream
// Rutas para Jefe (ver costos y márgenes)
=======
// Rutas para Jefe - ver costos y márgenes
>>>>>>> Stashed changes
router.get('/costos', verifyToken, requireRole('JEFE'), productosController.getProductosConCostos);

module.exports = router;