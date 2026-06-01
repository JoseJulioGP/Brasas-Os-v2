const db = require('../../shared/database/db');

// SRP: Solo maneja la lógica de negocio relacionada con productos
// DIP: Depende de la abstracción db, no de implementaciones concretas

class ProductosService {
<<<<<<< HEAD

  async getAll(filtros = {}) {
    let sql = `
      SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion,
             COALESCE(p.margen, p.precio_venta - COALESCE(p.costo_produccion, 0)) AS margen,
             p.activo, p.local_id, p.categoria_id, p.created_at, p.updated_at,
             c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = true
    `;
    const values = [];
    let idx = 1;

    if (filtros.categoria_id) {
      sql += ` AND p.categoria_id = $${idx++}`;
      values.push(filtros.categoria_id);
    }

    sql += ` ORDER BY p.nombre`;

    if (filtros.limit)  { sql += ` LIMIT $${idx++}`;  values.push(parseInt(filtros.limit)); }
    if (filtros.offset) { sql += ` OFFSET $${idx++}`; values.push(parseInt(filtros.offset)); }

    const [rows, count] = await Promise.all([
      db.query(sql, values),
      db.query(
        `SELECT COUNT(*) AS total FROM productos WHERE activo = true${filtros.categoria_id ? ' AND categoria_id = $1' : ''}`,
        filtros.categoria_id ? [filtros.categoria_id] : []
      )
    ]);

    return {
      data: rows.rows,
      total: parseInt(count.rows[0].total),
    };
  }

  async getById(id) {
    const sql = `
      SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion,
             COALESCE(p.margen, p.precio_venta - COALESCE(p.costo_produccion, 0)) AS margen,
             p.activo, p.local_id, p.categoria_id, p.created_at, p.updated_at,
             c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1 AND p.activo = true
    `;
    const result = await db.query(sql, [id]);
    if (!result.rows[0]) return null;
    const producto = result.rows[0];
    producto.insumos = await this._getInsumosByProductoId(id);
    return producto;
  }

  async getAllWithCostos() {
    const sql = `
      SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion,
             COALESCE(p.margen, p.precio_venta - COALESCE(p.costo_produccion, 0)) AS margen,
             CASE
               WHEN COALESCE(p.costo_produccion, 0) > 0
               THEN ROUND((p.precio_venta - p.costo_produccion) / p.costo_produccion * 100, 2)
               ELSE 0
             END AS porcentaje_margen,
             p.activo, p.categoria_id, c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = true
      ORDER BY margen DESC
    `;
=======
  // GET /productos - Lista productos activos
  async getAll() {
    const sql = `SELECT id, nombre, precio_venta, categoria, activo, created_at
                FROM productos
                WHERE activo = true
                ORDER BY nombre`;
>>>>>>> feature/frontend
    const result = await db.query(sql);
    return result.rows;
  }

  // GET /productos/:id - Obtener un producto por ID con sus insumos
  async getById(id) {
    const sql = `SELECT id, nombre, precio_venta, categoria, costo_produccion, activo, created_at
                FROM productos
                WHERE id = $1 AND activo = true`;
    const result = await db.query(sql, [id]);
    const producto = result.rows[0];
    if (!producto) return null;

    producto.insumos = await this._getInsumosByProductoId(id);
    return producto;
  }

  // GET /productos/costos - Productos con costos y márgenes (solo JEFE)
  async getAllWithCostos() {
    const sql = `SELECT id, nombre, precio_venta, costo_produccion, categoria, activo, created_at,
                (precio_venta - COALESCE(costo_produccion, 0)) as margen
                FROM productos
                WHERE activo = true
                ORDER BY nombre`;
    const result = await db.query(sql);
    return result.rows;
  }

  // POST /productos - Crear producto con insumos
  async create(data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
<<<<<<< HEAD
      const result = await client.query(
        `INSERT INTO productos (local_id, categoria_id, nombre, precio_venta, costo_produccion, activo, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING *`,
        [data.local_id || null, data.categoria_id || null, data.nombre, data.precio_venta, data.costo_produccion || 0]
      );
      const producto = result.rows[0];

      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        for (const ins of data.insumos) {
          await client.query(
            `INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida) VALUES ($1, $2, $3)`,
            [producto.id, ins.insumo_id, ins.cantidad_requerida]
=======

      const sql = `INSERT INTO productos (nombre, precio_venta, costo_produccion, categoria, activo, created_at)
                  VALUES ($1, $2, $3, $4, true, NOW())
                  RETURNING *`;
      const result = await client.query(sql, [
        data.nombre,
        data.precio_venta,
        data.costo_produccion || 0,
        data.categoria || null
      ]);
      const producto = result.rows[0];

      if (data.insumos && data.insumos.length > 0) {
        for (const ins of data.insumos) {
          await client.query(
            `INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida, unidad)
             VALUES ($1, $2, $3, $4)`,
            [producto.id, ins.insumo_id, ins.cantidad_requerida, ins.unidad || null]
>>>>>>> feature/frontend
          );
        }
      }

      await client.query('COMMIT');
      return this.getById(producto.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // PUT /productos/:id - Actualizar producto con insumos
  async update(id, data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
<<<<<<< HEAD
      const campos = [];
      const valores = [];
      let i = 1;

      if (data.nombre           !== undefined) { campos.push(`nombre = $${i++}`);           valores.push(data.nombre); }
      if (data.precio_venta     !== undefined) { campos.push(`precio_venta = $${i++}`);     valores.push(data.precio_venta); }
      if (data.costo_produccion !== undefined) { campos.push(`costo_produccion = $${i++}`); valores.push(data.costo_produccion); }
      if (data.categoria_id     !== undefined) { campos.push(`categoria_id = $${i++}`);     valores.push(data.categoria_id); }
      if (data.activo           !== undefined) { campos.push(`activo = $${i++}`);            valores.push(data.activo); }

      if (campos.length > 0) {
        campos.push(`updated_at = NOW()`);
        valores.push(id);
        await client.query(`UPDATE productos SET ${campos.join(', ')} WHERE id = $${i}`, valores);
=======

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
>>>>>>> feature/frontend
      }

      if (updates.length > 0) {
        updates.push('updated_at = NOW()');
        values.push(id);
        const sql = `UPDATE productos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        await client.query(sql, values);
      }

      // Reemplazar insumos
      await client.query('DELETE FROM producto_insumos WHERE producto_id = $1', [id]);

      if (data.insumos && data.insumos.length > 0) {
        for (const ins of data.insumos) {
          await client.query(
            `INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida) VALUES ($1, $2, $3)`,
            [id, ins.insumo_id, ins.cantidad_requerida]
          );
        }
      }
      await client.query('COMMIT');
      return this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // DELETE /productos/:id - Soft delete (solo cambia activo a false)
  async delete(id) {
    const result = await db.query(
      `UPDATE productos SET activo = false, updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

<<<<<<< HEAD
  async getCategorias() {
    const sql = `SELECT id, nombre FROM categorias WHERE activo = true ORDER BY nombre`;
    const result = await db.query(sql);
    return result.rows;
  }

  async getEstadisticas() {
    const sql = `
      SELECT COUNT(*) AS total_productos,
             AVG(precio_venta) AS promedio_precio,
             MAX(precio_venta) AS precio_maximo,
             MIN(precio_venta) AS precio_minimo
      FROM productos WHERE activo = true
    `;
    const result = await db.query(sql);
    return result.rows[0];
=======
  // === PRIVADOS ===

  async _getInsumosByProductoId(productoId) {
    const sql = `SELECT pi.insumo_id, pi.cantidad_requerida, pi.unidad, i.nombre, i.unidad_medida
                FROM producto_insumos pi
                JOIN insumos i ON pi.insumo_id = i.id
                WHERE pi.producto_id = $1
                ORDER BY i.nombre`;
    const result = await db.query(sql, [productoId]);
    return result.rows;
>>>>>>> feature/frontend
  }

  async _getInsumosByProductoId(productoId) {
    const sql = `
      SELECT pi.insumo_id, pi.cantidad_requerida, i.nombre, i.unidad_medida
      FROM producto_insumos pi
      JOIN insumos i ON pi.insumo_id = i.id
      WHERE pi.producto_id = $1
      ORDER BY i.nombre
    `;
    const result = await db.query(sql, [productoId]);
    return result.rows;
  }
}

module.exports = new ProductosService();
