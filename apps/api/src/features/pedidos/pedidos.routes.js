const express = require('express');
const router = express.Router();
const pedidosController = require('./pedidos.controller');
const { verifyToken, requireRole } = require('../../shared/middlewares/auth.middleware');

// Rutas para empleados (crear y gestionar sus pedidos)
router.post('/', verifyToken, pedidosController.createPedido);
router.get('/', verifyToken, pedidosController.getPedidos);
router.get('/:id', verifyToken, pedidosController.getPedidoById);
router.put('/:id/estado', verifyToken, pedidosController.updateEstado);

// Rutas para Jefe (supervisión)
router.get('/todos', verifyToken, requireRole('JEFE'), pedidosController.getAllPedidos);

// Rutas para Admin (editar/cancelar cualquier pedido)
router.put('/:id', verifyToken, requireRole('ADMIN'), pedidosController.updatePedido);
router.delete('/:id', verifyToken, requireRole('ADMIN'), pedidosController.cancelPedido);

module.exports = router;