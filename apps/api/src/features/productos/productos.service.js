const db = require('../../shared/database/db');

// SRP: Solo maneja la lógica de negocio relacionada con productos
// DIP: Depende de la abstracción db, no de implementaciones concretas

class ProductosService {
  // GET /productos - Lista productos activos
  async getAll() {
    const sql = `SELECT id, nombre, precio_venta, categoria, activo, created_at
                FROM productos
                WHERE activo = true
                ORDER BY nombre`;
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
            `INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida, unidad)
             VALUES ($1, $2, $3, $4)`,
            [id, ins.insumo_id, ins.cantidad_requerida, ins.unidad || null]
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
    const sql = `UPDATE productos SET activo = false WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

  // === PRIVADOS ===

  async _getInsumosByProductoId(productoId) {
    const sql = `SELECT pi.insumo_id, pi.cantidad_requerida, pi.unidad, i.nombre, i.unidad_medida
                FROM producto_insumos pi
                JOIN insumos i ON pi.insumo_id = i.id
                WHERE pi.producto_id = $1
                ORDER BY i.nombre`;
    const result = await db.query(sql, [productoId]);
    return result.rows;
  }
}

module.exports = new ProductosService();