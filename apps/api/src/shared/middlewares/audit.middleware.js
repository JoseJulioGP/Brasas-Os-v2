const historialService = require('../../features/historial/historial.service');
const { TIPOS_ACCION } = require('../constants/audit');

const METHOD_TO_ACCION = {
  POST:   TIPOS_ACCION.CREAR,
  PUT:    TIPOS_ACCION.EDITAR,
  PATCH:  TIPOS_ACCION.EDITAR,
  DELETE: TIPOS_ACCION.ELIMINAR,
};

const auditMiddleware = (req, res, next) => {
  const accion = METHOD_TO_ACCION[req.method];
  if (!accion) return next();

  res.on('finish', () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    try {
      const parts    = req.path.replace(/^\/api\/v\d+\//, '').split('/').filter(Boolean);
      const entidad  = parts[0] || null;
      const entidad_id = parts[1] || null;

      if (entidad === 'historial' || entidad === 'auth') return;

      historialService.registrar({
        usuario_id:  req.user?.id     || null,
        rol_id:      req.user?.rol_id || null,
        tipo_accion: accion,
        entidad,
        entidad_id,
        descripcion: `${accion} ${entidad}${entidad_id ? ` [${entidad_id}]` : ''}`,
      }).catch(() => {});
    } catch (_) {
      // fallo silencioso
    }
  });

  next();
};

module.exports = { auditMiddleware };
