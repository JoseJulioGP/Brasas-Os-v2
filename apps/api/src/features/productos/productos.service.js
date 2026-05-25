const db = require('../../shared/database/db');

class ProductosService {
  async getAll(filtros = {}) {
    let sql = `SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion,
                      p.categoria, p.activo, p.created_at,
                      (p.precio_venta - COALESCE(p.costo_produccion, 0)) as margen
               FROM productos p
               WHERE p.activo = true`;
    const values = [];
    let paramIndex = 1;

    if (filtros.categoria) {
      sql += ` AND p.categoria = $${paramIndex++}`;
      values.push(filtros.categoria);
    }

    sql += ` ORDER BY p.nombre`;

    if (filtros.limit) {
      sql += ` LIMIT $${paramIndex++}`;
      values.push(parseInt(filtros.limit));
    }

    if (filtros.offset) {
      sql += ` OFFSET $${paramIndex++}`;
      values.push(parseInt(filtros.offset));
    }

    const result = await db.query(sql, values);

    let countSql = `SELECT COUNT(*) as total FROM productos WHERE activo = true`;
    const countValues = [];
    if (filtros.categoria) {
      countSql += ` AND categoria = $1`;
      countValues.push(filtros.categoria);
    }
    const countResult = await db.query(countSql, countValues);

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      filtros: {
        categoria: filtros.categoria || null,
        limite: filtros.limit || null
      }
    };
  }

  async getById(id) {
    const sql = `SELECT p.*,
                        (p.precio_venta - COALESCE(p.costo_produccion, 0)) as margen
                 FROM productos p
                 WHERE p.id = $1 AND p.activo = true`;
    const result = await db.query(sql, [id]);
    if (!result.rows[0]) return null;
    const producto = result.rows[0];
    const insumosResult = await db.query(
      `SELECT pi.insumo_id, pi.cantidad_requerida, pi.unidad, i.nombre
       FROM producto_insumos pi
       JOIN insumos i ON pi.insumo_id = i.id
       WHERE pi.producto_id = $1`,
      [id]
    );
    producto.insumos = insumosResult.rows;
    return producto;
  }

  async getAllWithCostos() {
    const sql = `SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion, 
                        p.categoria, p.activo, p.created_at,
                        (p.precio_venta - COALESCE(p.costo_produccion, 0)) as margen,
                        CASE 
                          WHEN p.costo_produccion > 0 
                          THEN ROUND((p.precio_venta - p.costo_produccion) / p.costo_produccion * 100, 2)
                          ELSE 0 
                        END as porcentaje_margen
                 FROM productos p
                 WHERE p.activo = true
                 ORDER BY margen DESC`;
    const result = await db.query(sql);
    return result.rows;
  }

  async create(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO productos (nombre, precio_venta, costo_produccion, categoria, activo)
         VALUES ($1, $2, $3, $4, true) RETURNING *`,
        [data.nombre, data.precio_venta, data.costo_produccion || 0, data.categoria || null]
      );
      const producto = result.rows[0];
      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        for (const ins of data.insumos) {
          await client.query(
            `INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida, unidad)
             VALUES ($1, $2, $3, $4)`,
            [producto.id, ins.insumo_id, ins.cantidad_requerida, ins.unidad || null]
          );
        }
      }
      await client.query('COMMIT');
      return this.getById(producto.id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async update(id, data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (data.nombre !== undefined)          { updates.push(`nombre = $${paramIndex++}`);          values.push(data.nombre); }
      if (data.precio_venta !== undefined)     { updates.push(`precio_venta = $${paramIndex++}`);    values.push(data.precio_venta); }
      if (data.costo_produccion !== undefined) { updates.push(`costo_produccion = $${paramIndex++}`);values.push(data.costo_produccion); }
      if (data.categoria !== undefined)        { updates.push(`categoria = $${paramIndex++}`);        values.push(data.categoria); }
      if (data.activo !== undefined)           { updates.push(`activo = $${paramIndex++}`);           values.push(data.activo); }

      if (updates.length > 0) {
        values.push(id);
        await client.query(
          `UPDATE productos SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      }

      if (Array.isArray(data.insumos)) {
        await client.query('DELETE FROM producto_insumos WHERE producto_id = $1', [id]);
        for (const ins of data.insumos) {
          await client.query(
            `INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida, unidad)
             VALUES ($1, $2, $3, $4)`,
            [id, ins.insumo_id, ins.cantidad_requerida, ins.unidad || null]
          );
        }
      }

      await client.query('COMMIT');
      return this.getById(id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const sql = `UPDATE productos SET activo = false WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

  async getCategorias() {
    const sql = `SELECT DISTINCT categoria FROM productos WHERE categoria IS NOT NULL AND activo = true ORDER BY categoria`;
    const result = await db.query(sql);
    return result.rows.map(row => row.categoria);
  }

  async getEstadisticas() {
    const sql = `SELECT 
                   COUNT(*) as total_productos,
                   AVG(precio_venta) as promedio_precio,
                   SUM(precio_venta * COALESCE(stock_actual, 0)) as valor_total_stock,
                   MAX(precio_venta) as precio_maximo,
                   MIN(precio_venta) as precio_minimo
                 FROM productos WHERE activo = true`;
    const result = await db.query(sql);
    return result.rows[0];
  }
}

module.exports = new ProductosService();