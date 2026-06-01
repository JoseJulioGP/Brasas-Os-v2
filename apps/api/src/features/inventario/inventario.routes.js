const express = require('express');
const router = express.Router();
const inventarioController = require('./inventario.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

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
