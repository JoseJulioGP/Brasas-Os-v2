const express = require('express');
const router = express.Router();
const reportesController = require('./reportes.controller');

const { verifyToken, requireAnyRole } = require('../../shared/middlewares/auth.middleware');

// T-44 / T-45 / T-48: resumen financiero — solo JEFE y ADMIN (T-51: EMPLEADO no puede ver esto)
router.get('/resumen', verifyToken, requireAnyRole('JEFE', 'ADMIN'), reportesController.getResumen);

// T-49: turno del empleado — accesible para todos los roles
router.get('/turno', verifyToken, reportesController.getTurno);

// Proyecciones financieras a 12 meses — solo JEFE y ADMIN
router.get('/proyecciones', verifyToken, requireAnyRole('JEFE', 'ADMIN'), reportesController.getProyecciones);
router.get('/pagos',        verifyToken, requireAnyRole('JEFE', 'ADMIN'), reportesController.getResumenPagos);
router.get('/top-productos', verifyToken, requireAnyRole('JEFE', 'ADMIN'), reportesController.getTopProductos);

module.exports = router;