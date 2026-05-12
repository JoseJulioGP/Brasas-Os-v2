const db = require('../../shared/database/db');

// SRP: Solo maneja la lógica de negocio relacionada con inventario

class InventarioService {
  // === CARNES ===

  async getCarnes() {
    const sql = `SELECT id, corte, kg_comprados, kg_disponibles, precio_por_kg, proveedor, fecha_compra
                FROM carnes 
                ORDER BY fecha_compra DESC`;
    const result = await db.query(sql);
    return result.rows;
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
    let paramIndex = 1;

    if (data.corte !== undefined) {
      updates.push(`corte = $${paramIndex++}`);
      values.push(data.corte);
    }
    if (data.kg_disponibles !== undefined) {
      updates.push(`kg_disponibles = $${paramIndex++}`);
      values.push(data.kg_disponibles);
    }
    if (data.precio_por_kg !== undefined) {
      updates.push(`precio_por_kg = $${paramIndex++}`);
      values.push(data.precio_por_kg);
    }
    if (data.proveedor !== undefined) {
      updates.push(`proveedor = $${paramIndex++}`);
      values.push(data.proveedor);
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);
    const sql = `UPDATE carnes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(sql, values);
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
    const sql = `INSERT INTO insumos (nombre, categoria, unidad_medida, stock_actual, stock_minimo, activo, created_at)
                VALUES ($1, $2, $3, $4, $5, true, NOW())
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
    let paramIndex = 1;

    if (data.nombre !== undefined) {
      updates.push(`nombre = $${paramIndex++}`);
      values.push(data.nombre);
    }
    if (data.categoria !== undefined) {
      updates.push(`categoria = $${paramIndex++}`);
      values.push(data.categoria);
    }
    if (data.unidad_medida !== undefined) {
      updates.push(`unidad_medida = $${paramIndex++}`);
      values.push(data.unidad_medida);
    }
    if (data.stock_actual !== undefined) {
      updates.push(`stock_actual = $${paramIndex++}`);
      values.push(data.stock_actual);
    }
    if (data.stock_minimo !== undefined) {
      updates.push(`stock_minimo = $${paramIndex++}`);
      values.push(data.stock_minimo);
    }
    if (data.activo !== undefined) {
      updates.push(`activo = $${paramIndex++}`);
      values.push(data.activo);
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);
    const sql = `UPDATE insumos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(sql, values);
    return result.rows[0];
  }

  // === MOVIMIENTOS ===

  async getMovimientos(filtros) {
    let sql = `SELECT sm.*, i.nombre as insumo_nombre
              FROM stock_movimientos sm
              LEFT JOIN insumos i ON sm.insumo_id = i.id
              WHERE 1=1`;
    const values = [];
    let paramIndex = 1;

    if (filtros.insumo_id) {
      sql += ` AND sm.insumo_id = $${paramIndex++}`;
      values.push(filtros.insumo_id);
    }
    if (filtros.tipo) {
      sql += ` AND sm.tipo = $${paramIndex++}`;
      values.push(filtros.tipo);
    }
    if (filtros.fecha_inicio) {
      sql += ` AND sm.fecha >= $${paramIndex++}`;
      values.push(filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      sql += ` AND sm.fecha <= $${paramIndex++}`;
      values.push(filtros.fecha_fin);
    }

    sql += ` ORDER BY sm.fecha DESC`;
    const result = await db.query(sql, values);
    return result.rows;
  }

  async createMovimiento(data) {
    // RNF-05: No permitir stock negativo
    if (data.tipo === 'SALIDA') {
      const insumo = await this.getInsumoById(data.insumo_id);
      if (insumo && insumo.stock_actual < data.cantidad) {
        throw new Error('STOCK_NEGATIVO');
      }
    }

    const sql = `INSERT INTO stock_movimientos (insumo_id, usuario_id, tipo, cantidad, costo_unitario, motivo, fecha)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                RETURNING *`;
    const result = await db.query(sql, [
      data.insumo_id,
      data.usuario_id,
      data.tipo,
      data.cantidad,
      data.costo_unitario || null,
      data.motivo || null
    ]);

    // Actualizar stock del insumo
    const signo = data.tipo === 'ENTRADA' ? 1 : -1;
    await db.query(
      'UPDATE insumos SET stock_actual = stock_actual + ($1 * $2) WHERE id = $3',
      [data.cantidad, signo, data.insumo_id]
    );

    return result.rows[0];
  }
}

module.exports = new InventarioService();