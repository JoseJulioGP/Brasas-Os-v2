const express = require('express');
const router = express.Router();
const authController = require('./controller');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyToken, authController.me);

module.exports = router;
