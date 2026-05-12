const express = require('express');
const router = express.Router();
const inventarioController = require('./inventario.controller');
const { verifyToken, requireRole } = require('../../shared/middlewares/auth.middleware');

// Rutas para Jefe (gestión de inventario completo)
router.get('/carnes', verifyToken, requireRole('JEFE'), inventarioController.getCarnes);
router.post('/carnes', verifyToken, requireRole('JEFE'), inventarioController.createCarne);
router.put('/carnes/:id', verifyToken, requireRole('JEFE'), inventarioController.updateCarne);

// Rutas para empleados (solo consulta de carnes disponibles)
router.get('/carnes/consulta', verifyToken, inventarioController.getCarnesDisponibles);

// Rutas de insumos
router.get('/insumos', verifyToken, requireRole('JEFE'), inventarioController.getInsumos);
router.post('/insumos', verifyToken, requireRole('JEFE'), inventarioController.createInsumo);
router.put('/insumos/:id', verifyToken, requireRole('JEFE'), inventarioController.updateInsumo);

// Movimientos de stock
router.get('/movimientos', verifyToken, requireRole('JEFE'), inventarioController.getMovimientos);
router.post('/movimientos', verifyToken, requireRole('JEFE'), inventarioController.createMovimiento);

module.exports = router;