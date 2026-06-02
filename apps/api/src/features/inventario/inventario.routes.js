const express = require('express');
const router = express.Router();
const inventarioController = require('./inventario.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de insumos y movimientos de stock 🔒 Requiere token
 */

/**
 * @swagger
 * /inventario/insumos:
 *   get:
 *     summary: Listar insumos del local 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insumos del local autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insumo'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Permisos insuficientes (requiere JEFE o ADMIN)
 *   post:
 *     summary: Crear insumo 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, unidad_medida]
 *             properties:
 *               nombre:         { type: string, example: Carne de res }
 *               tipo:           { type: string, enum: [insumo, carne], example: carne }
 *               unidad_medida:  { type: string, example: kg }
 *               stock_actual:   { type: number, example: 10 }
 *               stock_minimo:   { type: number, example: 2 }
 *               costo_unitario_prom: { type: number, example: 8500 }
 *     responses:
 *       201:
 *         description: Insumo creado
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Permisos insuficientes
 */
router.get('/insumos',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumos);
router.post('/insumos',    verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createInsumo);

/**
 * @swagger
 * /inventario/insumos/{id}:
 *   get:
 *     summary: Obtener insumo por ID 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Insumo encontrado
 *       404:
 *         description: Insumo no encontrado
 *   put:
 *     summary: Actualizar insumo 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insumo'
 *     responses:
 *       200:
 *         description: Insumo actualizado
 *       404:
 *         description: Insumo no encontrado
 *   delete:
 *     summary: Eliminar insumo 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Insumo eliminado
 *       404:
 *         description: Insumo no encontrado
 */
router.get('/insumos/:id',    verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getInsumoById);
router.put('/insumos/:id',    verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.updateInsumo);
router.delete('/insumos/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.deleteInsumo);

/**
 * @swagger
 * /inventario/insumos/{id}/stock-minimo:
 *   patch:
 *     summary: Actualizar stock mínimo 🔒 Solo ADMIN
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_minimo: { type: number, example: 5 }
 *     responses:
 *       200:
 *         description: Stock mínimo actualizado
 *       403:
 *         description: Solo ADMIN puede modificar el stock mínimo
 */
router.patch('/insumos/:id/stock-minimo', verifyToken, requireRole('ADMIN'), inventarioController.updateStockMinimo);

/**
 * @swagger
 * /inventario/movimientos:
 *   get:
 *     summary: Listar movimientos de stock 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: insumo_id
 *         schema: { type: string }
 *       - in: query
 *         name: tipo
 *         schema: { type: string, enum: [entrada, salida] }
 *       - in: query
 *         name: fecha_inicio
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: fecha_fin
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Lista de movimientos del local
 *
 * /inventario/entrada:
 *   post:
 *     summary: Registrar entrada de stock 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [insumo_id, cantidad]
 *             properties:
 *               insumo_id:      { type: string, format: uuid }
 *               cantidad:       { type: number, example: 5 }
 *               costo_unitario: { type: number, example: 8500 }
 *               motivo:         { type: string, example: Compra proveedor }
 *     responses:
 *       201:
 *         description: Entrada registrada, stock actualizado
 *
 * /inventario/salida:
 *   post:
 *     summary: Registrar salida de stock 🔒
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [insumo_id, cantidad]
 *             properties:
 *               insumo_id: { type: string, format: uuid }
 *               cantidad:  { type: number, example: 2 }
 *               motivo:    { type: string, example: Uso en producción }
 *     responses:
 *       201:
 *         description: Salida registrada, stock actualizado
 *       400:
 *         description: Stock insuficiente
 */
router.get('/movimientos',  verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.getMovimientos);
router.post('/entrada',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createEntrada);
router.post('/salida',      verifyToken, requireAnyRole('JEFE', 'ADMIN'), inventarioController.createSalida);

module.exports = router;
