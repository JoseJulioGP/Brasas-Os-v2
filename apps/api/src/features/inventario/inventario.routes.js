const express = require('express');
const router = express.Router();
const inventarioController = require('./inventario.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// === CARNES ===
router.get('/carnes/disponibles', verifyToken, inventarioController.getCarnesDisponibles);
router.get('/carnes', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getCarnes);
router.post('/carnes', verifyToken, requireRole('JEFE'), inventarioController.createCarne);
router.put('/carnes/:id', verifyToken, requireRole('JEFE'), inventarioController.updateCarne);

// === INSUMOS ===
// T-23: stock_minimo solo ADMIN
router.patch('/insumos/:id/stock-minimo', verifyToken, requireRole('ADMIN'), inventarioController.updateStockMinimo);
router.get('/insumos/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumoById);
router.get('/insumos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumos);
router.post('/insumos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createInsumo);
router.put('/insumos/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.updateInsumo);

// === MOVIMIENTOS ===
// T-21: rutas semánticas /entrada y /salida
router.post('/entrada', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createEntrada);
router.post('/salida', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createSalida);
router.get('/movimientos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getMovimientos);

module.exports = router;
