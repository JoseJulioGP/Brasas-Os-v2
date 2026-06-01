const historialService = require('./historial.service');

const getHistorial = async (req, res) => {
  const {
    usuario_id, rol, tipo_accion, entidad,
    fecha_inicio, fecha_fin,
    page  = 1,
    limit = 20,
  } = req.query;

  if (tipo_accion && !historialService.VALID_TIPOS.includes(tipo_accion)) {
    return res.status(400).json({
      message: `tipo_accion inválido. Permitidos: ${historialService.VALID_TIPOS.join(', ')}`,
    });
  }
  if (entidad && !historialService.VALID_ENTIDADES.includes(entidad)) {
    return res.status(400).json({
      message: `entidad inválida. Permitidas: ${historialService.VALID_ENTIDADES.join(', ')}`,
    });
  }

  try {
    const result = await historialService.getHistorial(
      req.user.rol,
      req.user.id,
      { usuario_id, rol, tipo_accion, entidad, fecha_inicio, fecha_fin, page, limit },
    );
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting historial:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getHistorial };
