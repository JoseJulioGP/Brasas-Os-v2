const db = require('../shared/database');

/**
 * CarnesService - SRP: Única responsabilidad de gestión de carnes
 */
class CarnesService {
  async obtenerTodas() {
    try {
      const sql = `SELECT c.*, 
                         (SELECT COUNT(*) FROM inventario_carnes 
                          WHERE carne_id = c.id) as total_inventario
                   FROM carnes c
                   WHERE c.activo = true`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo carnes:", error);
    }
  }

  async obtenerPorId(id) {
    try {
      const sql = `SELECT * FROM carnes WHERE id = $1 AND activo = true`;
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo carne:", error);
    }
  }

  async crearCarne(data) {
    try {
      const sql = `INSERT INTO carnes (nombre_corte, descripcion, precio_kg, activo) 
                    VALUES ($1, $2, $3, true) RETURNING *`;
      const result = await db.query(sql, [data.nombre_corte, data.descripcion, data.precio_kg]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando carne:", error);
    }
  }

  async actualizarCarne(id, data) {
    try {
      const sql = `UPDATE carnes 
                    SET nombre_corte = COALESCE($1, nombre_corte),
                        descripcion = COALESCE($2, descripcion),
                        precio_kg = COALESCE($3, precio_kg),
                        activo = COALESCE($4, activo)
                    WHERE id = $5 AND activo = true RETURNING *`;
      const result = await db.query(sql, [data.nombre_corte, data.descripcion, data.precio_kg, data.activo, id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error actualizando carne:", error);
    }
  }

  async eliminarCarne(id) {
    try {
      const sql = `UPDATE carnes SET activo = false WHERE id = $1`;
      const result = await db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error eliminando carne:", error);
    }
  }

  async obtenerInventarioCarnes(carneId) {
    try {
      const sql = `SELECT * FROM inventario_carnes WHERE carne_id = $1`;
      const result = await db.query(sql, [carneId]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo inventario:", error);
    }
  }

  async actualizarInventarioCarne(id, data) {
    try {
      const sql = `UPDATE inventario_carnes 
                    SET kg_disponibles = COALESCE($1, kg_disponibles),
                        kg_usados = COALESCE($2, kg_usados),
                        fecha_modificacion = CURRENT_TIMESTAMP
                    WHERE id = $3 RETURNING *`;
      const result = await db.query(sql, [data.kg_disponibles, data.kg_usados, id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error actualizando inventario:", error);
    }
  }
}

module.exports = new CarnesService();
