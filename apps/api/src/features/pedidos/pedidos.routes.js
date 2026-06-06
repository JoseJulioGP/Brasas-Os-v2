const express = require('express');
const router = express.Router();
const pedidosController = require('./pedidos.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// IMPORTANTE: rutas específicas ANTES de /:id para evitar conflictos
router.get('/todos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), pedidosController.getAllPedidos);

// Rutas generales (empleado crea y gestiona sus pedidos)
router.post('/', verifyToken, pedidosController.createPedido);
router.get('/', verifyToken, pedidosController.getPedidos);
router.get('/:id', verifyToken, pedidosController.getPedidoById);
router.put('/:id/estado', verifyToken, pedidosController.updateEstado);

// ADMIN edita cualquier pedido; cancelar es para todos (el controller valida propiedad para EMPLEADO)
router.put('/:id', verifyToken, requireRole('ADMIN'), pedidosController.updatePedido);
router.delete('/:id', verifyToken, pedidosController.cancelPedido);

module.exports = router;