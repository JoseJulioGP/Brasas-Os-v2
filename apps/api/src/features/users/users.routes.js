const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { verifyToken, requireRole, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// Mis empleados — JEFE ve solo los de su local
router.get('/mis-empleados', verifyToken, requireAnyRole('JEFE', 'ADMIN'), usersController.getMisEmpleados);

// Código de invitación — accesible para JEFE y ADMIN
router.get('/codigo-invitacion',  verifyToken, requireAnyRole('JEFE', 'ADMIN'), usersController.getCodigoInvitacion);
router.post('/codigo-invitacion', verifyToken, requireAnyRole('JEFE', 'ADMIN'), usersController.generarCodigoInvitacion);

// CRUD de usuarios — solo ADMIN
router.post('/',    verifyToken, requireRole('ADMIN'), usersController.createUser);
router.get('/',     verifyToken, requireRole('ADMIN'), usersController.getUsers);
router.get('/:id',  verifyToken, requireRole('ADMIN'), usersController.getUserById);
router.put('/:id',  verifyToken, requireRole('ADMIN'), usersController.updateUser);
router.delete('/:id', verifyToken, requireRole('ADMIN'), usersController.deactivateUser);

module.exports = router;
