const db = require('../../shared/database/db');

<<<<<<< Updated upstream
class ProductosService {
  async getAll() {
    const sql = `SELECT id, nombre, precio_venta, categoria, activo, created_at
                 FROM productos 
                 WHERE activo = true
                 ORDER BY nombre`;
=======
// SRP: Solo maneja la lógica de negocio relacionada con productos
// DIP: Depende de la abstracción db, no de implementaciones concretas

class ProductosService {
  // GET /productos - Lista productos activos
  async getAll() {
    const sql = `SELECT id, nombre, precio_venta, categoria, activo, created_at
                FROM productos 
                WHERE activo = true
                ORDER BY nombre`;
>>>>>>> Stashed changes
    const result = await db.query(sql);
    return result.rows;
  }

<<<<<<< Updated upstream
  async getById(id) {
    const sql = `SELECT id, nombre, precio_venta, categoria, costo_produccion, activo, created_at
                 FROM productos 
                 WHERE id = $1 AND activo = true`;
=======
  // GET /productos/:id - Obtener un producto por ID
  async getById(id) {
    const sql = `SELECT id, nombre, precio_venta, categoria, costo_produccion, activo, created_at
                FROM productos 
                WHERE id = $1 AND activo = true`;
>>>>>>> Stashed changes
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

<<<<<<< Updated upstream
  async getAllWithCostos() {
    const sql = `SELECT id, nombre, precio_venta, costo_produccion, categoria, activo, created_at,
                 (precio_venta - costo_produccion) as margen
                 FROM productos 
                 WHERE activo = true
                 ORDER BY nombre`;
=======
  // GET /productos/costos - Productos con costos y márgenes (solo JEFE)
  async getAllWithCostos() {
    const sql = `SELECT id, nombre, precio_venta, costo_produccion, categoria, activo, created_at,
                (precio_venta - COALESCE(costo_produccion, 0)) as margen
                FROM productos 
                WHERE activo = true
                ORDER BY nombre`;
>>>>>>> Stashed changes
    const result = await db.query(sql);
    return result.rows;
  }

<<<<<<< Updated upstream
  async create(data) {
    const sql = `INSERT INTO productos (nombre, precio_venta, costo_produccion, categoria, activo, created_at)
                 VALUES ($1, $2, $3, $4, true, NOW())
                 RETURNING *`;
=======
  // POST /productos - Crear producto
  async create(data) {
    const sql = `INSERT INTO productos (nombre, precio_venta, costo_produccion, categoria, activo, created_at)
                VALUES ($1, $2, $3, $4, true, NOW())
                RETURNING *`;
>>>>>>> Stashed changes
    const result = await db.query(sql, [
      data.nombre,
      data.precio_venta,
      data.costo_produccion || 0,
      data.categoria || null
    ]);
    return result.rows[0];
  }

<<<<<<< Updated upstream
=======
  // PUT /productos/:id - Actualizar producto
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  // DELETE /productos/:id - Soft delete (solo cambia activo a false)
>>>>>>> Stashed changes
  async delete(id) {
    const sql = `UPDATE productos SET activo = false WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }
}

module.exports = new ProductosService();