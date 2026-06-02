const db = require('../../shared/database/db');

class InventarioService {

  // === INSUMOS ===

  async getInsumos(local_id) {
    const sql = `SELECT id, nombre, tipo, unidad_medida, stock_actual, stock_minimo,
                        costo_unitario_prom, activo, created_at
                 FROM insumos
                 WHERE activo = true AND local_id = $1
                 ORDER BY nombre`;
    const result = await db.query(sql, [local_id]);
    return result.rows;
  }

  async getInsumoById(id, local_id) {
    const sql = `SELECT id, nombre, tipo, unidad_medida, stock_actual, stock_minimo,
                        costo_unitario_prom, activo, created_at
                 FROM insumos
                 WHERE id = $1 AND local_id = $2`;
    const result = await db.query(sql, [id, local_id]);
    return result.rows[0];
  }

  async createInsumo(data) {
    const sql = `INSERT INTO insumos (local_id, nombre, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, activo)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, true)
                 RETURNING *`;
    const result = await db.query(sql, [
      data.local_id            || null,
      data.nombre,
      data.tipo                || 'insumo',
      data.unidad_medida,
      data.stock_actual        || 0,
      data.stock_minimo        || 0,
      data.costo_unitario_prom || 0,
    ]);
    return result.rows[0];
  }

  async updateInsumo(id, data, local_id) {
    const updates = [];
    const values  = [];
    let i = 1;

    if (data.nombre !== undefined)             { updates.push(`nombre = $${i++}`);             values.push(data.nombre); }
    if (data.tipo !== undefined)               { updates.push(`tipo = $${i++}`);               values.push(data.tipo); }
    if (data.unidad_medida !== undefined)      { updates.push(`unidad_medida = $${i++}`);      values.push(data.unidad_medida); }
    if (data.stock_actual !== undefined)       { updates.push(`stock_actual = $${i++}`);       values.push(data.stock_actual); }
    if (data.costo_unitario_prom !== undefined) { updates.push(`costo_unitario_prom = $${i++}`); values.push(data.costo_unitario_prom); }
    if (data.activo !== undefined)             { updates.push(`activo = $${i++}`);             values.push(data.activo); }

    if (updates.length === 0) return null;

    values.push(id, local_id);
    const result = await db.query(
      `UPDATE insumos SET ${updates.join(', ')} WHERE id = $${i} AND local_id = $${i + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async deleteInsumo(id, local_id) {
    const result = await db.query(
      `DELETE FROM insumos WHERE id = $1 AND local_id = $2 RETURNING id`,
      [id, local_id]
    );
    return result.rows[0] || null;
  }

  async updateStockMinimo(id, stock_minimo, local_id) {
    const result = await db.query(
      `UPDATE insumos SET stock_minimo = $1 WHERE id = $2 AND local_id = $3 RETURNING *`,
      [stock_minimo, id, local_id]
    );
    return result.rows[0];
  }

  // === MOVIMIENTOS ===

  async getMovimientos(filtros = {}) {
    let sql = `SELECT sm.*, i.nombre as insumo_nombre, i.unidad_medida
               FROM stock_movimientos sm
               LEFT JOIN insumos i ON sm.insumo_id = i.id
               WHERE i.local_id = $1`;
    const values = [filtros.local_id];
    let i = 2;

    if (filtros.insumo_id)    { sql += ` AND sm.insumo_id = $${i++}`;    values.push(filtros.insumo_id); }
    if (filtros.tipo)         { sql += ` AND sm.tipo = $${i++}`;         values.push(filtros.tipo); }
    if (filtros.fecha_inicio) { sql += ` AND sm.created_at >= $${i++}`;  values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)    { sql += ` AND sm.created_at <= $${i++}`;  values.push(filtros.fecha_fin); }

    sql += ` ORDER BY sm.created_at DESC`;
    const result = await db.query(sql, values);
    return result.rows;
  }

  async createMovimiento(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const insumoResult = await client.query(
        'SELECT stock_actual, stock_minimo FROM insumos WHERE id = $1 AND local_id = $2',
        [data.insumo_id, data.local_id]
      );
      const insumo = insumoResult.rows[0];

      if (!insumo) throw new Error('INSUMO_NO_ENCONTRADO');

      if (data.tipo === 'salida' && insumo.stock_actual < data.cantidad) {
        throw new Error('STOCK_INSUFICIENTE');
      }

      const movResult = await client.query(
        `INSERT INTO stock_movimientos (insumo_id, usuario_id, tipo, cantidad, costo_unitario, motivo)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [data.insumo_id, data.usuario_id, data.tipo, data.cantidad, data.costo_unitario || null, data.motivo || null]
      );

      const signo = data.tipo === 'entrada' ? 1 : -1;
      const stockResult = await client.query(
        `UPDATE insumos SET stock_actual = stock_actual + ($1 * $2) WHERE id = $3
         RETURNING stock_actual, stock_minimo`,
        [data.cantidad, signo, data.insumo_id]
      );

      await client.query('COMMIT');

      const { stock_actual, stock_minimo } = stockResult.rows[0];
      return {
        movimiento: movResult.rows[0],
        stock_actual,
        alerta_stock: parseFloat(stock_actual) <= parseFloat(stock_minimo),
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new InventarioService();
