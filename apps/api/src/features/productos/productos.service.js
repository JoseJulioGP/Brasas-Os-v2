const db = require('../../shared/database/db');

class ProductosService {
  async getAll() {
    const sql = `SELECT id, nombre, precio_venta, categoria, activo, created_at
                 FROM productos 
                 WHERE activo = true
                 ORDER BY nombre`;
    const result = await db.query(sql);
    return result.rows;
  }

  async getById(id) {
    const sql = `SELECT id, nombre, precio_venta, categoria, costo_produccion, activo, created_at
                 FROM productos 
                 WHERE id = $1 AND activo = true`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

  async getAllWithCostos() {
    const sql = `SELECT id, nombre, precio_venta, costo_produccion, categoria, activo, created_at,
                 (precio_venta - costo_produccion) as margen
                 FROM productos 
                 WHERE activo = true
                 ORDER BY nombre`;
    const result = await db.query(sql);
    return result.rows;
  }

  async create(data) {
    const sql = `INSERT INTO productos (nombre, precio_venta, costo_produccion, categoria, activo, created_at)
                 VALUES ($1, $2, $3, $4, true, NOW())
                 RETURNING *`;
    const result = await db.query(sql, [
      data.nombre,
      data.precio_venta,
      data.costo_produccion || 0,
      data.categoria || null
    ]);
    return result.rows[0];
  }

  async update(id, data) {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (data.nombre !== undefined) {
      updates.push(`nombre = $${paramIndex++}`);
      values.push(data.nombre);
    }
    if (data.precio_venta !== undefined) {
      updates.push(`precio_venta = $${paramIndex++}`);
      values.push(data.precio_venta);
    }
    if (data.costo_produccion !== undefined) {
      updates.push(`costo_produccion = $${paramIndex++}`);
      values.push(data.costo_produccion);
    }
    if (data.categoria !== undefined) {
      updates.push(`categoria = $${paramIndex++}`);
      values.push(data.categoria);
    }
    if (data.activo !== undefined) {
      updates.push(`activo = $${paramIndex++}`);
      values.push(data.activo);
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const sql = `UPDATE productos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(sql, values);
    return result.rows[0];
  }

  async delete(id) {
    const sql = `UPDATE productos SET activo = false WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }
}

module.exports = new ProductosService();