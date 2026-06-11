const db = require('../../shared/database/db');

// Agrupa insumos duplicados sumando sus cantidades
function deduplicarInsumos(insumos) {
  const map = {};
  for (const ins of insumos) {
    if (!ins.insumo_id) continue;
    if (map[ins.insumo_id]) {
      map[ins.insumo_id].cantidad_requerida += parseFloat(ins.cantidad_requerida) || 0;
    } else {
      map[ins.insumo_id] = { insumo_id: ins.insumo_id, cantidad_requerida: parseFloat(ins.cantidad_requerida) || 0 };
    }
  }
  return Object.values(map);
}

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

  async _calcularCostoDesdeInsumos(client, insumos) {
    if (!Array.isArray(insumos) || insumos.length === 0) return 0;
    const dedup = deduplicarInsumos(insumos);
    let costo = 0;
    for (const ins of dedup) {
      const r = await client.query(
        `SELECT costo_unitario_prom FROM insumos WHERE id = $1`,
        [ins.insumo_id]
      );
      const costoUnit = parseFloat(r.rows[0]?.costo_unitario_prom) || 0;
      costo += costoUnit * ins.cantidad_requerida;
    }
    return Math.round(costo);
  }

  async create(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const costoCalculado = await this._calcularCostoDesdeInsumos(client, data.insumos);
      const result = await client.query(
        `INSERT INTO productos (local_id, categoria_id, nombre, precio_venta, costo_produccion, activo, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING *`,
        [data.local_id || null, data.categoria_id || null, data.nombre, data.precio_venta, costoCalculado]
      );
      const producto = result.rows[0];
      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        const dedup = deduplicarInsumos(data.insumos);
        for (const ins of dedup) {
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
      const costoCalculado = await this._calcularCostoDesdeInsumos(client, data.insumos);
      const campos = []; const valores = []; let i = 1;
      if (data.nombre           !== undefined) { campos.push(`nombre = $${i++}`);           valores.push(data.nombre); }
      if (data.precio_venta     !== undefined) { campos.push(`precio_venta = $${i++}`);     valores.push(data.precio_venta); }
      campos.push(`costo_produccion = $${i++}`); valores.push(costoCalculado);
      if (data.categoria_id     !== undefined) { campos.push(`categoria_id = $${i++}`);     valores.push(data.categoria_id || null); }
      if (data.activo           !== undefined) { campos.push(`activo = $${i++}`);            valores.push(data.activo); }
      if (campos.length > 0) { campos.push(`updated_at = NOW()`); valores.push(id, local_id); await client.query(`UPDATE productos SET ${campos.join(', ')} WHERE id = $${i} AND local_id IS NOT DISTINCT FROM $${i + 1}`, valores); }
      await client.query('DELETE FROM producto_insumos WHERE producto_id = $1', [id]);
      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        const dedup = deduplicarInsumos(data.insumos);
        for (const ins of dedup) await client.query(`INSERT INTO producto_insumos (producto_id, insumo_id, cantidad_requerida) VALUES ($1, $2, $3)`, [id, ins.insumo_id, ins.cantidad_requerida]);
      }
      await client.query('COMMIT');
      return this.getById(id, local_id);
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async recalcularCostos(local_id) {
    const productos = await db.query(
      `SELECT p.id, pi.insumo_id, pi.cantidad_requerida, i.costo_unitario_prom
       FROM productos p
       JOIN producto_insumos pi ON pi.producto_id = p.id
       JOIN insumos i ON i.id = pi.insumo_id
       WHERE p.activo = true AND p.local_id IS NOT DISTINCT FROM $1`,
      [local_id]
    );
    const costosMap = {};
    for (const row of productos.rows) {
      if (!costosMap[row.id]) costosMap[row.id] = 0;
      costosMap[row.id] += (parseFloat(row.costo_unitario_prom) || 0) * parseFloat(row.cantidad_requerida);
    }
    let actualizados = 0;
    for (const [id, costo] of Object.entries(costosMap)) {
      await db.query(
        `UPDATE productos SET costo_produccion = $1, updated_at = NOW() WHERE id = $2`,
        [Math.round(costo), id]
      );
      actualizados++;
    }
    return actualizados;
  }

  async delete(id, local_id) {
    return (await db.query(`UPDATE productos SET activo = false, updated_at = NOW() WHERE id = $1 AND local_id IS NOT DISTINCT FROM $2 RETURNING id`, [id, local_id])).rows[0];
  }

  async getCategorias() {
    return (await db.query(`SELECT id, nombre FROM categorias WHERE activo = true AND ambito = 'producto' ORDER BY nombre`)).rows;
  }

  async createCategoria(nombre) {
    const existe = await db.query(`SELECT id FROM categorias WHERE LOWER(nombre) = LOWER($1) AND activo = true`, [nombre]);
    if (existe.rows[0]) throw new Error('CATEGORIA_DUPLICADA');
    const result = await db.query(
      `INSERT INTO categorias (nombre, ambito, activo) VALUES ($1, 'producto', true) RETURNING id, nombre`,
      [nombre]
    );
    return result.rows[0];
  }

  async deleteCategoria(id) {
    const result = await db.query(
      `UPDATE categorias SET activo = false WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

  async _getInsumosByProductoId(productoId) {
    return (await db.query(`SELECT pi.insumo_id, pi.cantidad_requerida, i.nombre, i.unidad_medida FROM producto_insumos pi JOIN insumos i ON pi.insumo_id = i.id WHERE pi.producto_id = $1 ORDER BY i.nombre`, [productoId])).rows;
  }
}

module.exports = new ProductosService();
