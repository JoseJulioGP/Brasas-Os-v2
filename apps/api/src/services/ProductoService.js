const db = require('../shared/database');

class ProductoService {
  async obtenerTodos() {
    try {
      const sql = `SELECT p.*, c.nombre as categoria_nombre,
                          c.id as categoria_id,
                          ca.nombre as carne_nombre
                   FROM productos p
                   LEFT JOIN categorias c ON p.categoria_id = c.id
                   LEFT JOIN carnes ca ON p.carne_id = ca.id
                   WHERE p.activo = true
                   ORDER BY p.nombre`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  }

  async obtenerPorId(id) {
    try {
      const sql = `SELECT * FROM productos WHERE id = $1 AND activo = true`;
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo producto:", error);
    }
  }

  async obtenerPorCategoria(categoriaId) {
    try {
      const sql = `SELECT * FROM productos 
                    WHERE categoria_id = $1 AND activo = true`;
      const result = await db.query(sql, [categoriaId]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo productos por categoría:", error);
    }
  }

  async crearProducto(data) {
    try {
      const sql = `INSERT INTO productos (nombre, descripcion, precio_venta, stock_actual, 
                        stock_minimo, categoria_id, carne_id, activo) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`;
      const result = await db.query(sql, [
        data.nombre, 
        data.descripcion, 
        data.precio_venta, 
        data.stock_actual, 
        data.stock_minimo, 
        data.categoria_id, 
        data.carne_id || null
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  }

  async actualizarProducto(id, data) {
    try {
      const sql = `UPDATE productos 
                    SET nombre = COALESCE($1, nombre),
                        descripcion = COALESCE($2, descripcion),
                        precio_venta = COALESCE($3, precio_venta),
                        stock_actual = COALESCE($4, stock_actual),
                        stock_minimo = COALESCE($5, stock_minimo)
                    WHERE id = $6 AND activo = true RETURNING *`;
      const result = await db.query(sql, [
        data.nombre, 
        data.descripcion, 
        data.precio_venta, 
        data.stock_actual, 
        data.stock_minimo, 
        id
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      const sql = `UPDATE productos SET activo = false WHERE id = $1`;
      const result = await db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  }

  async buscarProductos(nombre) {
    try {
      const sql = `SELECT * FROM productos 
                    WHERE activo = true 
                    AND (nombre ILIKE $1 OR descripcion ILIKE $1)
                    ORDER BY nombre`;
      const result = await db.query(sql, [`%${nombre}%`]);
      return result.rows;
    } catch (error) {
      console.error("Error buscando productos:", error);
    }
  }

  async obtenerStockBajo() {
    try {
      const sql = `SELECT * FROM productos 
                    WHERE activo = true 
                    AND stock_actual <= stock_minimo`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo productos con stock bajo:", error);
    }
  }
}

module.exports = new ProductoService();
