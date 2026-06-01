const { Router } = require('express');
const { verifyToken, requireAnyRole } = require('../../shared/middlewares/auth.middleware');
const { getHistorial } = require('./historial.controller');

const router = Router();

router.get('/', verifyToken, requireAnyRole('ADMIN', 'JEFE', 'EMPLEADO'), getHistorial);

module.exports = router;
