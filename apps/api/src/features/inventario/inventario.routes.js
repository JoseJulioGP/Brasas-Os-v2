const express = require('express');
const router = express.Router();
const inventarioController = require('./inventario.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// === CARNES ===
// T-30: /carnes/entrada como ruta semántica (específica antes que /:id)
router.get('/carnes/disponibles', verifyToken, inventarioController.getCarnesDisponibles);
router.post('/carnes/entrada', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createCarne);
router.get('/carnes', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getCarnes);
router.post('/carnes', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createCarne);
router.put('/carnes/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.updateCarne);

// === PRODUCTO-CARNES (T-32) ===
router.get('/producto-carnes/:producto_id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getProductoCarne);
router.put('/producto-carnes/:producto_id', verifyToken, requireRole('ADMIN'), inventarioController.setProductoCarne);

// === INSUMOS ===
router.patch('/insumos/:id/stock-minimo', verifyToken, requireRole('ADMIN'), inventarioController.updateStockMinimo);
router.get('/insumos/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumoById);
router.get('/insumos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumos);
router.post('/insumos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createInsumo);
router.put('/insumos/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.updateInsumo);

// === MOVIMIENTOS ===
router.post('/entrada', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createEntrada);
router.post('/salida', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createSalida);
router.get('/movimientos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getMovimientos);

module.exports = router;