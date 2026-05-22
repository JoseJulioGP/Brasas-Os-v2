const reportesService = require('./reportes.service');

// T-44: resumen financiero — solo JEFE y ADMIN
const getResumen = async (req, res) => {
  const { periodo } = req.query;

  const periodosValidos = ['diario', 'semanal', 'mensual'];
  const periodoFinal = periodosValidos.includes(periodo) ? periodo : 'mensual';

  try {
    const resumen = await reportesService.getResumen(periodoFinal);
    res.status(200).json(resumen);
  } catch (error) {
    console.error('Error getting resumen:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// T-49: turno del empleado — todos los roles
// EMPLEADO siempre ve su propio turno; JEFE/ADMIN pueden consultar cualquier empleado
const getTurno = async (req, res) => {
  const rol = req.user.rol;
  const empleado_id = rol === 'EMPLEADO' ? req.user.id : (req.query.empleado_id || req.user.id);

  try {
    const turno = await reportesService.getTurnoEmpleado(empleado_id);
    res.status(200).json(turno);
  } catch (error) {
    console.error('Error getting turno:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getResumen, getTurno };