const db = require('../../shared/database/db');

class HistorialRepository {
  async insert({ usuario_id, local_id, entidad, entidad_id, accion, detalle }) {
    const sql = `
      INSERT INTO historial (usuario_id, local_id, entidad, entidad_id, accion, detalle, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *
    `;
    const result = await db.query(sql, [
      usuario_id || null,
      local_id   || null,
      entidad    || null,
      this._toUuidOrNull(entidad_id),
      accion     || null,
      detalle    ? JSON.stringify(detalle) : null,
    ]);
    return result.rows[0];
  }

  async findAll({ usuario_id, local_id, accion, entidad, fecha_inicio, fecha_fin, page = 1, limit = 20, entidades_whitelist } = {}) {
    const values = [];
    let idx = 1;
    const conditions = [];

    if (local_id)    { conditions.push(`h.local_id = $${idx++}`);    values.push(local_id); }
    if (usuario_id)  { conditions.push(`h.usuario_id = $${idx++}`);  values.push(usuario_id); }
    if (accion)      { conditions.push(`h.accion = $${idx++}`);      values.push(accion); }
    if (entidad)     { conditions.push(`h.entidad = $${idx++}`);     values.push(entidad); }
    if (fecha_inicio){ conditions.push(`h.created_at >= $${idx++}`); values.push(fecha_inicio); }
    if (fecha_fin)   { conditions.push(`h.created_at <= $${idx++}`); values.push(fecha_fin); }
    if (entidades_whitelist?.length) {
      const ph = entidades_whitelist.map(() => `$${idx++}`).join(', ');
      conditions.push(`h.entidad IN (${ph})`);
      values.push(...entidades_whitelist);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const base  = `FROM historial h LEFT JOIN usuarios u ON h.usuario_id = u.id ${where}`;

    const countResult = await db.query(`SELECT COUNT(*) AS total ${base}`, values);
    const total = parseInt(countResult.rows[0].total);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataSql = `
      SELECT h.id, h.usuario_id, h.entidad, h.entidad_id, h.accion, h.detalle, h.created_at,
             u.nombre AS usuario_nombre
      ${base} ORDER BY h.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(parseInt(limit), offset);
    const dataResult = await db.query(dataSql, values);
    return { data: dataResult.rows, total };
  }

  _toUuidOrNull(value) {
    if (!value) return null;
    const r = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return r.test(String(value)) ? String(value) : null;
  }
}

module.exports = new HistorialRepository();
