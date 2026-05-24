const db = require('../../shared/database/db');

class InventarioService {
  // === CARNES ===

 async getCarnes() {
  const sql = `SELECT id, corte, kg_comprados, kg_disponibles, precio_por_kg, proveedor, fecha_compra,
                      (kg_disponibles < 2) as alerta_stock
               FROM carnes
               ORDER BY fecha_compra DESC`;
  const result = await db.query(sql);
  return result.rows;
}

// T-32: consultar configuración de carne de un producto
async getProductoCarne(producto_id) {
  const result = await db.query(
    `SELECT pc.*, p.nombre as producto_nombre
     FROM producto_carnes pc
     JOIN productos p ON pc.producto_id = p.id
     WHERE pc.producto_id = $1`,
    [producto_id]
  );
  return result.rows[0];
}

// T-32: upsert — si ya existe la configuración la actualiza, si no la crea
async setProductoCarne(producto_id, corte_ref, kg_requeridos) {
  const result = await db.query(
    `INSERT INTO producto_carnes (producto_id, corte_ref, kg_requeridos)
     VALUES ($1, $2, $3)
     ON CONFLICT (producto_id)
     DO UPDATE SET corte_ref = $2, kg_requeridos = $3
     RETURNING *`,
    [producto_id, corte_ref, kg_requeridos]
  );
  return result.rows[0];
}

  async getCarnesDisponibles() {
    const sql = `SELECT id, corte, kg_disponibles, precio_por_kg
                 FROM carnes
                 WHERE kg_disponibles > 0
                 ORDER BY corte`;
    const result = await db.query(sql);
    return result.rows;
  }

  async createCarne(data) {
    const sql = `INSERT INTO carnes (corte, kg_comprados, kg_disponibles, precio_por_kg, proveedor, fecha_compra)
                 VALUES ($1, $2, $3, $4, $5, NOW())
                 RETURNING *`;
    const result = await db.query(sql, [
      data.corte,
      data.kg_comprados,
      data.kg_disponibles || data.kg_comprados,
      data.precio_por_kg,
      data.proveedor || null
    ]);
    return result.rows[0];
  }

  async updateCarne(id, data) {
    const updates = [];
    const values = [];
    let i = 1;

    if (data.corte !== undefined)         { updates.push(`corte = $${i++}`);          values.push(data.corte); }
    if (data.kg_disponibles !== undefined) { updates.push(`kg_disponibles = $${i++}`); values.push(data.kg_disponibles); }
    if (data.precio_por_kg !== undefined)  { updates.push(`precio_por_kg = $${i++}`);  values.push(data.precio_por_kg); }
    if (data.proveedor !== undefined)      { updates.push(`proveedor = $${i++}`);       values.push(data.proveedor); }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await db.query(
      `UPDATE carnes SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // === INSUMOS ===

  async getInsumos() {
    const sql = `SELECT id, nombre, categoria, unidad_medida, stock_actual, stock_minimo, activo, created_at
                 FROM insumos
                 WHERE activo = true
                 ORDER BY nombre`;
    const result = await db.query(sql);
    return result.rows;
  }

  async getInsumoById(id) {
    const sql = `SELECT id, nombre, categoria, unidad_medida, stock_actual, stock_minimo, activo, created_at
                 FROM insumos
                 WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

  async createInsumo(data) {
    const sql = `INSERT INTO insumos (nombre, categoria, unidad_medida, stock_actual, stock_minimo, activo)
                 VALUES ($1, $2, $3, $4, $5, true)
                 RETURNING *`;
    const result = await db.query(sql, [
      data.nombre,
      data.categoria || null,
      data.unidad_medida,
      data.stock_actual || 0,
      data.stock_minimo || 0
    ]);
    return result.rows[0];
  }

  async updateInsumo(id, data) {
    const updates = [];
    const values = [];
    let i = 1;

    if (data.nombre !== undefined)       { updates.push(`nombre = $${i++}`);        values.push(data.nombre); }
    if (data.categoria !== undefined)    { updates.push(`categoria = $${i++}`);     values.push(data.categoria); }
    if (data.unidad_medida !== undefined){ updates.push(`unidad_medida = $${i++}`); values.push(data.unidad_medida); }
    if (data.stock_actual !== undefined) { updates.push(`stock_actual = $${i++}`);  values.push(data.stock_actual); }
    if (data.activo !== undefined)       { updates.push(`activo = $${i++}`);        values.push(data.activo); }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await db.query(
      `UPDATE insumos SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  // T-23: stock_minimo solo lo modifica el ADMIN — método separado para que la ruta lo restrinja por rol
  async updateStockMinimo(id, stock_minimo) {
    const result = await db.query(
      `UPDATE insumos SET stock_minimo = $1 WHERE id = $2 RETURNING *`,
      [stock_minimo, id]
    );
    return result.rows[0];
  }

  // === MOVIMIENTOS ===

  async getMovimientos(filtros = {}) {
    let sql = `SELECT sm.*, i.nombre as insumo_nombre, i.unidad_medida
               FROM stock_movimientos sm
               LEFT JOIN insumos i ON sm.insumo_id = i.id
               WHERE 1=1`;
    const values = [];
    let i = 1;

    if (filtros.insumo_id)    { sql += ` AND sm.insumo_id = $${i++}`;     values.push(filtros.insumo_id); }
    if (filtros.tipo)         { sql += ` AND sm.tipo = $${i++}`;          values.push(filtros.tipo); }
    if (filtros.fecha_inicio) { sql += ` AND sm.fecha >= $${i++}`;        values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)    { sql += ` AND sm.fecha <= $${i++}`;        values.push(filtros.fecha_fin); }

    sql += ` ORDER BY sm.fecha DESC`;
    const result = await db.query(sql, values);
    return result.rows;
  }

  // RNF-05: INSERT + UPDATE atómicos con transacción — si falla el UPDATE el movimiento no queda huérfano
  async createMovimiento(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar stock suficiente antes de cualquier escritura
      const insumoResult = await client.query(
        'SELECT stock_actual, stock_minimo FROM insumos WHERE id = $1',
        [data.insumo_id]
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
        // T-25: el controller/frontend usa este flag para mostrar la alerta
        alerta_stock: parseFloat(stock_actual) <= parseFloat(stock_minimo)
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
