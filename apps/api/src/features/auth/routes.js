const express = require('express');
const router = express.Router();
const authController = require('./controller');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints públicos — no requieren token
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea un usuario con rol JEFE y genera su local propio. Retorna un token JWT con la contraseña ya cifrada en la DB.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: David García
 *               email:
 *                 type: string
 *                 example: david@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: Se guarda cifrada con bcrypt (nunca en texto plano)
 *     responses:
 *       201:
 *         description: Usuario creado — la contraseña en DB está cifrada con bcrypt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos faltantes o contraseña muy corta
 *       409:
 *         description: El email ya está registrado
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Verifica credenciales comparando la contraseña con el hash en DB. Retorna un token JWT firmado.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: david@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso — copiá el token y usalo en Authorize 🔓
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email o contraseña incorrectos
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener usuario autenticado 🔒
 *     description: Retorna los datos del usuario dueño del token JWT.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/me', verifyToken, authController.me);

module.exports = router;
