const db = require('../../shared/database/db');

class InventarioService {

  // === CARNES (insumos con tipo = 'carne') ===

  async getCarnes() {
    const sql = `
      SELECT i.id, i.nombre AS corte, i.stock_actual AS kg_disponibles,
             i.costo_unitario_prom AS precio_por_kg, i.stock_minimo,
             i.activo, i.local_id, i.categoria_id, i.created_at, i.updated_at,
             (i.stock_actual <= i.stock_minimo) AS alerta_stock
      FROM insumos i
      WHERE i.tipo = 'carne' AND i.activo = true
      ORDER BY i.nombre
    `;
    const result = await db.query(sql);
    return result.rows;
  }

  async createCarne(data) {
    const sql = `
      INSERT INTO insumos (local_id, nombre, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, activo, created_at, updated_at)
      VALUES ($1, $2, 'carne', 'kg', $3, $4, $5, true, NOW(), NOW())
      RETURNING *
    `;
    const result = await db.query(sql, [
      data.local_id || null,
      data.corte,
      data.kg_comprados || 0,
      data.stock_minimo || 0,
      data.precio_por_kg || 0,
    ]);
    const row = result.rows[0];
    return {
      id: row.id,
      corte: row.nombre,
      kg_disponibles: row.stock_actual,
      precio_por_kg: row.costo_unitario_prom,
      stock_minimo: row.stock_minimo,
      activo: row.activo,
    };
  }

  async updateCarne(id, data) {
    const campos = [];
    const valores = [];
    let i = 1;
    if (data.corte          !== undefined) { campos.push(`nombre = $${i++}`);              valores.push(data.corte); }
    if (data.kg_disponibles !== undefined) { campos.push(`stock_actual = $${i++}`);        valores.push(data.kg_disponibles); }
    if (data.precio_por_kg  !== undefined) { campos.push(`costo_unitario_prom = $${i++}`); valores.push(data.precio_por_kg); }
    if (data.stock_minimo   !== undefined) { campos.push(`stock_minimo = $${i++}`);        valores.push(data.stock_minimo); }
    if (campos.length === 0) return this.getCarneById(id);
    campos.push(`updated_at = NOW()`);
    valores.push(id);
    const result = await db.query(
      `UPDATE insumos SET ${campos.join(', ')} WHERE id = $${i} AND tipo = 'carne' RETURNING *`,
      valores
    );
    const row = result.rows[0];
    if (!row) return null;
    return { id: row.id, corte: row.nombre, kg_disponibles: row.stock_actual, precio_por_kg: row.costo_unitario_prom, stock_minimo: row.stock_minimo };
  }

  async getCarneById(id) {
    const result = await db.query(
      `SELECT id, nombre AS corte, stock_actual AS kg_disponibles, costo_unitario_prom AS precio_por_kg, stock_minimo, activo
       FROM insumos WHERE id = $1 AND tipo = 'carne'`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Devuelve los valores validos del enum tipo_insumo_enum
  async getEnumTipos() {
    const result = await db.query(
      `SELECT unnest(enum_range(NULL::tipo_insumo_enum))::text AS valor`
    );
    return result.rows.map(r => r.valor);
  }

  // === INSUMOS ===

  async getInsumos(tipo) {
    // No usar comparacion con 'carne' sin saber si el enum la acepta
    // Si se pasa tipo, filtra; si no, devuelve todos los insumos
    let sql;
    let params;

    if (tipo) {
      sql = `
        SELECT i.id, i.nombre, i.tipo, i.unidad_medida, i.stock_actual, i.stock_minimo,
               i.costo_unitario_prom, i.activo, i.local_id, i.categoria_id, i.created_at, i.updated_at,
               c.nombre AS categoria,
               (i.stock_actual <= i.stock_minimo) AS alerta_stock
        FROM insumos i
        LEFT JOIN categorias c ON i.categoria_id = c.id
        WHERE i.activo = true AND i.tipo = $1
        ORDER BY i.nombre
      `;
      params = [tipo];
    } else {
      sql = `
        SELECT i.id, i.nombre, i.tipo, i.unidad_medida, i.stock_actual, i.stock_minimo,
               i.costo_unitario_prom, i.activo, i.local_id, i.categoria_id, i.created_at, i.updated_at,
               c.nombre AS categoria,
               (i.stock_actual <= i.stock_minimo) AS alerta_stock
        FROM insumos i
        LEFT JOIN categorias c ON i.categoria_id = c.id
        WHERE i.activo = true
        ORDER BY i.nombre
      `;
      params = [];
    }

    const result = await db.query(sql, params);
    return result.rows;
  }

  async getInsumoById(id) {
    const sql = `
      SELECT i.id, i.nombre, i.tipo, i.unidad_medida, i.stock_actual, i.stock_minimo,
             i.costo_unitario_prom, i.activo, i.local_id, i.categoria_id, i.created_at, i.updated_at,
             c.nombre AS categoria,
             (i.stock_actual <= i.stock_minimo) AS alerta_stock
      FROM insumos i
      LEFT JOIN categorias c ON i.categoria_id = c.id
      WHERE i.id = $1
    `;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

  async createInsumo(data) {
    const sql = `
      INSERT INTO insumos (local_id, categoria_id, nombre, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, activo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
      RETURNING *
    `;
    const result = await db.query(sql, [
      data.local_id || null,
      data.categoria_id || null,
      data.nombre,
      data.tipo || null,
      data.unidad_medida,
      data.stock_actual || 0,
      data.stock_minimo || 0,
      data.costo_unitario_prom || 0,
    ]);
    return result.rows[0];
  }

  async updateInsumo(id, data) {
    const campos = [];
    const valores = [];
    let i = 1;
    if (data.nombre              !== undefined) { campos.push(`nombre = $${i++}`);              valores.push(data.nombre); }
    if (data.categoria_id        !== undefined) { campos.push(`categoria_id = $${i++}`);        valores.push(data.categoria_id); }
    if (data.tipo                !== undefined) { campos.push(`tipo = $${i++}`);                valores.push(data.tipo); }
    if (data.unidad_medida       !== undefined) { campos.push(`unidad_medida = $${i++}`);       valores.push(data.unidad_medida); }
    if (data.stock_actual        !== undefined) { campos.push(`stock_actual = $${i++}`);        valores.push(data.stock_actual); }
    if (data.stock_minimo        !== undefined) { campos.push(`stock_minimo = $${i++}`);        valores.push(data.stock_minimo); }
    if (data.costo_unitario_prom !== undefined) { campos.push(`costo_unitario_prom = $${i++}`); valores.push(data.costo_unitario_prom); }
    if (data.activo              !== undefined) { campos.push(`activo = $${i++}`);              valores.push(data.activo); }
    if (campos.length === 0) return this.getInsumoById(id);
    campos.push(`updated_at = NOW()`);
    valores.push(id);
    const result = await db.query(
      `UPDATE insumos SET ${campos.join(', ')} WHERE id = $${i} RETURNING *`,
      valores
    );
    return result.rows[0];
  }

  async updateStockMinimo(id, stock_minimo) {
    const result = await db.query(
      `UPDATE insumos SET stock_minimo = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [stock_minimo, id]
    );
    return result.rows[0];
  }

  // === MOVIMIENTOS ===

  async getMovimientos(filtros) {
    filtros = filtros || {};
    let sql = `
      SELECT sm.*, i.nombre AS insumo_nombre, i.unidad_medida
      FROM stock_movimientos sm
      LEFT JOIN insumos i ON sm.insumo_id = i.id
      WHERE 1=1
    `;
    const values = [];
    let i = 1;
    if (filtros.insumo_id)    { sql += ` AND sm.insumo_id = $${i++}`;   values.push(filtros.insumo_id); }
    if (filtros.tipo)         { sql += ` AND sm.tipo = $${i++}`;        values.push(filtros.tipo); }
    if (filtros.fecha_inicio) { sql += ` AND sm.created_at >= $${i++}`; values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)    { sql += ` AND sm.created_at <= $${i++}`; values.push(filtros.fecha_fin); }
    sql += ` ORDER BY sm.created_at DESC`;
    const result = await db.query(sql, values);
    return result.rows;
  }

  async createMovimiento(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const insumoResult = await client.query(
        'SELECT stock_actual, stock_minimo FROM insumos WHERE id = $1',
        [data.insumo_id]
      );
      const insumo = insumoResult.rows[0];
      if (!insumo) throw new Error('INSUMO_NO_ENCONTRADO');
      if (data.tipo === 'salida' && parseFloat(insumo.stock_actual) < parseFloat(data.cantidad)) {
        throw new Error('STOCK_INSUFICIENTE');
      }
      const movResult = await client.query(
        `INSERT INTO stock_movimientos (insumo_id, usuario_id, proveedor_id, tipo, cantidad, costo_unitario, motivo, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
        [data.insumo_id, data.usuario_id || null, data.proveedor_id || null,
         data.tipo, data.cantidad, data.costo_unitario || null, data.motivo || null]
      );
      const signo = data.tipo === 'entrada' ? 1 : -1;
      const stockResult = await client.query(
        `UPDATE insumos SET stock_actual = stock_actual + ($1 * $2), updated_at = NOW()
         WHERE id = $3 RETURNING stock_actual, stock_minimo`,
        [data.cantidad, signo, data.insumo_id]
      );
      if (data.tipo === 'entrada' && data.costo_unitario) {
        await client.query(
          `UPDATE insumos SET costo_unitario_prom = $1 WHERE id = $2`,
          [data.costo_unitario, data.insumo_id]
        );
      }
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
