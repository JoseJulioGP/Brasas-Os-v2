const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { verifyToken, requireRole } = require('../../shared/middlewares/auth.middleware');

// TODOS los endpoints de usuarios requieren token y rol ADMIN
router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.post('/', usersController.createUser);
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deactivateUser); // Soft delete

module.exports = router;