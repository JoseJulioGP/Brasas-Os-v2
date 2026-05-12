const db = require('../shared/database');

class CategoriaService {
  async obtenerTodas() {
    try {
      const sql = `SELECT * FROM categorias WHERE activo = true`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
    }
  }

  async obtenerPorId(id) {
    try {
      const sql = `SELECT * FROM categorias WHERE id = $1 AND activo = true`;
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo categoría:", error);
    }
  }

  async crearCategoria(data) {
    try {
      const sql = `INSERT INTO categorias (nombre, descripcion, activo) 
                    VALUES ($1, $2, true) RETURNING *`;
      const result = await db.query(sql, [data.nombre, data.descripcion]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando categoría:", error);
    }
  }

  async actualizarCategoria(id, data) {
    try {
      const sql = `UPDATE categorias 
                    SET nombre = COALESCE($1, nombre),
                        descripcion = COALESCE($2, descripcion)
                    WHERE id = $3 AND activo = true RETURNING *`;
      const result = await db.query(sql, [data.nombre, data.descripcion, id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  }

  async eliminarCategoria(id) {
    try {
      const sql = `UPDATE categorias SET activo = false WHERE id = $1`;
      const result = await db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  }

  async obtenerCategoriasConProductos() {
    try {
      const sql = `SELECT c.*, COUNT(p.id) as total_productos,
                          SUM(p.precio_venta) as total_valor
                   FROM categorias c
                   LEFT JOIN productos p ON c.id = p.categoria_id
                   WHERE c.activo = true
                   GROUP BY c.id, c.nombre, c.descripcion
                   ORDER BY c.nombre`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo categorías con productos:", error);
    }
  }
}

module.exports = new CategoriaService();
