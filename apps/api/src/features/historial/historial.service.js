const historialRepository = require('./historial.repository');
const { TIPOS_ACCION, ENTIDADES, ENTIDADES_NEGOCIO } = require('../../shared/constants/audit');

const VALID_TIPOS     = Object.values(TIPOS_ACCION);
const VALID_ENTIDADES = Object.values(ENTIDADES);

function buildScope(rol, filtros) {
  if (rol === 'ADMIN') return { ...filtros };

  if (rol === 'JEFE') {
    const entidadPermitida =
      filtros.entidad && ENTIDADES_NEGOCIO.includes(filtros.entidad) ? filtros.entidad : null;
    return {
      tipo_accion:         filtros.tipo_accion,
      fecha_inicio:        filtros.fecha_inicio,
      fecha_fin:           filtros.fecha_fin,
      page:                filtros.page,
      limit:               filtros.limit,
      entidades_whitelist: entidadPermitida ? [entidadPermitida] : ENTIDADES_NEGOCIO,
    };
  }

  // EMPLEADO — usuario_id siempre forzado
  return {
    usuario_id:   filtros._usuario_id_forzado,
    tipo_accion:  filtros.tipo_accion,
    fecha_inicio: filtros.fecha_inicio,
    fecha_fin:    filtros.fecha_fin,
    page:         filtros.page,
    limit:        filtros.limit,
  };
}

class HistorialService {
  async getHistorial(rol, userId, filtros = {}) {
    if (rol === 'EMPLEADO') filtros._usuario_id_forzado = userId;

    const scope = buildScope(rol, filtros);
    const { data, total } = await historialRepository.findAll(scope);

    return {
      data,
      total,
      page:  parseInt(filtros.page)  || 1,
      limit: parseInt(filtros.limit) || 20,
    };
  }

  async registrar({ usuario_id, rol_id, tipo_accion, entidad, entidad_id, descripcion }) {
    try {
      return await historialRepository.insert({ usuario_id, rol_id, tipo_accion, entidad, entidad_id, descripcion });
    } catch (err) {
      console.error('[Historial] fallo al registrar:', err.message);
    }
  }
}

const instance = new HistorialService();
instance.VALID_TIPOS     = VALID_TIPOS;
instance.VALID_ENTIDADES = VALID_ENTIDADES;

module.exports = instance;
