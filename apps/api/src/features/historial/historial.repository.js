const db = require('../../shared/database/db');

class HistorialRepository {
  async insert({ usuario_id, rol_id, tipo_accion, entidad, entidad_id, descripcion }) {
    const sql = `
      INSERT INTO historial (usuario_id, rol_id, tipo_accion, entidad, entidad_id, descripcion, fecha)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const result = await db.query(sql, [
      usuario_id || null,
      rol_id     || null,
      tipo_accion || null,
      entidad    || null,
      entidad_id ? String(entidad_id) : null,
      descripcion || null,
    ]);
    return result.rows[0];
  }

  async findAll({
    usuario_id,
    rol,
    tipo_accion,
    entidad,
    fecha_inicio,
    fecha_fin,
    page  = 1,
    limit = 20,
    entidades_whitelist,
  } = {}) {
    const values = [];
    let idx = 1;
    const conditions = [];

    if (usuario_id) {
      conditions.push(`h.usuario_id = $${idx++}`);
      values.push(usuario_id);
    }
    if (rol) {
      conditions.push(`r.nombre = $${idx++}`);
      values.push(rol);
    }
    if (tipo_accion) {
      conditions.push(`h.tipo_accion = $${idx++}`);
      values.push(tipo_accion);
    }
    if (entidad) {
      conditions.push(`h.entidad = $${idx++}`);
      values.push(entidad);
    }
    if (fecha_inicio) {
      conditions.push(`h.fecha >= $${idx++}`);
      values.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push(`h.fecha <= $${idx++}`);
      values.push(fecha_fin);
    }
    if (entidades_whitelist && entidades_whitelist.length > 0) {
      const placeholders = entidades_whitelist.map(() => `$${idx++}`).join(', ');
      conditions.push(`h.entidad IN (${placeholders})`);
      values.push(...entidades_whitelist);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const base = `
      FROM historial h
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      LEFT JOIN roles    r ON h.rol_id     = r.id
      ${where}
    `;

    const countResult = await db.query(`SELECT COUNT(*) AS total ${base}`, values);
    const total = parseInt(countResult.rows[0].total);

    const offset  = (parseInt(page) - 1) * parseInt(limit);
    const dataSql = `
      SELECT h.*,
             u.nombre AS usuario_nombre,
             r.nombre AS rol_nombre
      ${base}
      ORDER BY h.fecha DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(parseInt(limit), offset);

    const dataResult = await db.query(dataSql, values);
    return { data: dataResult.rows, total };
  }
}

module.exports = new HistorialRepository();
