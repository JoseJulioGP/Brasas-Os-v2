const express = require('express');
const router = express.Router();
const inventarioController = require('./inventario.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// === CARNES ===
router.get('/carnes',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getCarnes);
router.post('/carnes',    verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createCarne);
router.put('/carnes/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.updateCarne);

// Enum de tipos validos
router.get('/enum-tipos', verifyToken, inventarioController.getEnumTipos);

// === INSUMOS ===
router.get('/insumos',             verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumos);
router.get('/insumos/:id',         verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumoById);
router.post('/insumos',            verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createInsumo);
router.put('/insumos/:id',         verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.updateInsumo);
router.patch('/insumos/:id/stock-minimo', verifyToken, requireRole('ADMIN'), inventarioController.updateStockMinimo);

// === MOVIMIENTOS ===
router.get('/movimientos',  verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getMovimientos);
router.post('/entrada',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createEntrada);
router.post('/salida',      verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createSalida);

module.exports = router;
