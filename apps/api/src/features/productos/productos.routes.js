const express = require('express');
const router = express.Router();
const productosController = require('./productos.controller');
const { verifyToken, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión del menú del local 🔒 Requiere token
 */

/**
 * @swagger
 * /productos/categorias:
 *   get:
 *     summary: Listar categorías de productos 🔒
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías disponibles
 *
 * /productos/costos:
 *   get:
 *     summary: Productos con análisis de costos y márgenes 🔒 JEFE/ADMIN
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos con margen, costo y porcentaje de rentabilidad
 *       403:
 *         description: Requiere rol JEFE o ADMIN
 *
 * /productos:
 *   get:
 *     summary: Listar productos del local 🔒
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema: { type: string, format: uuid }
 *         description: Filtrar por categoría
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, example: 0 }
 *     responses:
 *       200:
 *         description: Lista de productos del local autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *   post:
 *     summary: Crear producto 🔒 JEFE/ADMIN
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio_venta]
 *             properties:
 *               nombre:           { type: string, example: Hamburguesa Clásica }
 *               precio_venta:     { type: number, example: 12000 }
 *               costo_produccion: { type: number, example: 4500 }
 *               categoria_id:     { type: string, format: uuid }
 *               insumos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     insumo_id:          { type: string, format: uuid }
 *                     cantidad_requerida: { type: number, example: 0.2 }
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos o costo >= precio
 *       403:
 *         description: Requiere rol JEFE o ADMIN
 *
 * /productos/{id}:
 *   get:
 *     summary: Obtener producto por ID 🔒
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Producto encontrado con sus insumos
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualizar producto 🔒 JEFE/ADMIN
 *     tags: [Productos]
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
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       403:
 *         description: Requiere rol JEFE o ADMIN
 *   delete:
 *     summary: Eliminar producto (soft delete) 🔒 JEFE/ADMIN
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Producto desactivado correctamente
 *       403:
 *         description: Requiere rol JEFE o ADMIN
 */

// Rutas específicas ANTES de /:id
router.get('/costos',     verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.getProductosConCostos);
router.get('/categorias', verifyToken, productosController.getCategorias);

// Catálogo
router.get('/',     verifyToken, productosController.getProductos);
router.get('/:id',  verifyToken, productosController.getProductoById);

// JEFE y ADMIN pueden gestionar el menú
router.post('/',      verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.createProducto);
router.put('/:id',    verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.updateProducto);
router.delete('/:id', verifyToken, requireAnyRole('JEFE', 'ADMIN'), productosController.deleteProducto);

module.exports = router;
