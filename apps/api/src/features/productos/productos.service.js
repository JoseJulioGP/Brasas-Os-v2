const db = require('../../shared/database/db');

class ProductosService {

  async getAll(filtros = {}) {
    let sql = `SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion, COALESCE(p.margen, p.precio_venta - COALESCE(p.costo_produccion,0)) AS margen, p.activo, p.local_id, p.categoria_id, p.created_at, p.updated_at, c.nombre AS categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.activo = true AND p.local_id IS NOT DISTINCT FROM $1`;
    const values = [filtros.local_id]; let idx = 2;
    if (filtros.categoria_id) { sql += ` AND p.categoria_id = $${idx++}`; values.push(filtros.categoria_id); }
    sql += ` ORDER BY p.nombre`;
    if (filtros.limit)  { sql += ` LIMIT $${idx++}`;  values.push(parseInt(filtros.limit)); }
    if (filtros.offset) { sql += ` OFFSET $${idx++}`; values.push(parseInt(filtros.offset)); }
    return (await db.query(sql, values)).rows;
  }

  async getById(id, local_id) {
    const result = await db.query(
      `SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion, COALESCE(p.margen, p.precio_venta - COALESCE(p.costo_produccion,0)) AS margen, p.activo, p.local_id, p.categoria_id, p.created_at, p.updated_at, c.nombre AS categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = $1 AND p.local_id IS NOT DISTINCT FROM $2 AND p.activo = true`,
      [id, local_id]
    );
    if (!result.rows[0]) return null;
    const producto = result.rows[0];
    producto.insumos = await this._getInsumosByProductoId(id);
    return producto;
  }

  async getAllWithCostos(local_id) {
    return (await db.query(
      `SELECT p.id, p.nombre, p.precio_venta, p.costo_produccion, COALESCE(p.margen, p.precio_venta - COALESCE(p.costo_produccion,0)) AS margen, CASE WHEN COALESCE(p.costo_produccion,0) > 0 THEN ROUND((p.precio_venta - p.costo_produccion)/p.costo_produccion*100,2) ELSE 0 END AS porcentaje_margen, p.activo, p.categoria_id, c.nombre AS categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.activo = true AND p.local_id IS NOT DISTINCT FROM $1 ORDER BY margen DESC`,
      [local_id]
    )).rows;
  }

  async create(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO productos (local_id, categoria_id, nombre, precio_venta, costo_produccion, activo, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING *`,
        [data.local_id || null, data.categoria_id || null, data.nombre, data.precio_venta, data.costo_produccion || 0]
      );
      const producto = result.rows[0];
      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        for (const ins of data.insumos) {
          await client.query(`INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida) VALUES ($1, $2, $3)`, [producto.id, ins.insumo_id, ins.cantidad_requerida]);
        }
      }
      await client.query('COMMIT');
      return this.getById(producto.id, data.local_id);
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async update(id, data, local_id) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const campos = []; const valores = []; let i = 1;
      if (data.nombre           !== undefined) { campos.push(`nombre = $${i++}`);           valores.push(data.nombre); }
      if (data.precio_venta     !== undefined) { campos.push(`precio_venta = $${i++}`);     valores.push(data.precio_venta); }
      if (data.costo_produccion !== undefined) { campos.push(`costo_produccion = $${i++}`); valores.push(data.costo_produccion); }
      if (data.categoria_id     !== undefined) { campos.push(`categoria_id = $${i++}`);     valores.push(data.categoria_id || null); }
      if (data.activo           !== undefined) { campos.push(`activo = $${i++}`);            valores.push(data.activo); }
      if (campos.length > 0) { campos.push(`updated_at = NOW()`); valores.push(id, local_id); await client.query(`UPDATE productos SET ${campos.join(', ')} WHERE id = $${i} AND local_id IS NOT DISTINCT FROM $${i + 1}`, valores); }
      await client.query('DELETE FROM producto_insumos WHERE producto_id = $1', [id]);
      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        for (const ins of data.insumos) await client.query(`INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida) VALUES ($1, $2, $3)`, [id, ins.insumo_id, ins.cantidad_requerida]);
      }
      await client.query('COMMIT');
      return this.getById(id, local_id);
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async delete(id, local_id) {
    return (await db.query(`UPDATE productos SET activo = false, updated_at = NOW() WHERE id = $1 AND local_id IS NOT DISTINCT FROM $2 RETURNING id`, [id, local_id])).rows[0];
  }

  async getCategorias() {
    return (await db.query(`SELECT id, nombre FROM categorias WHERE activo = true AND ambito = 'producto' ORDER BY nombre`)).rows;
  }

  async _getInsumosByProductoId(productoId) {
    return (await db.query(`SELECT pi.insumo_id, pi.cantidad_requerida, i.nombre, i.unidad_medida FROM producto_insumos pi JOIN insumos i ON pi.insumo_id = i.id WHERE pi.producto_id = $1 ORDER BY i.nombre`, [productoId])).rows;
  }
}

module.exports = new ProductosService();
