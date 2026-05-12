const db = require('../shared/database');

class UsuarioService {
  async obtenerTodos() {
    try {
      const sql = `SELECT u.*, r.nombre as rol_nombre,
                          c.nombre as categoria_nombre
                   FROM usuarios u
                   LEFT JOIN roles r ON u.rol_id = r.id
                   LEFT JOIN categorias c ON u.categoria_id = c.id
                   WHERE u.activo = true
                   ORDER BY u.nombre`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  }

  async obtenerPorEmail(email) {
    try {
      const sql = `SELECT * FROM usuarios WHERE email = $1 AND activo = true`;
      const result = await db.query(sql, [email]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo usuario por email:", error);
    }
  }

  async obtenerPorId(id) {
    try {
      const sql = `SELECT * FROM usuarios WHERE id = $1 AND activo = true`;
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }
  }

  async crearUsuario(data) {
    try {
      const sql = `INSERT INTO usuarios (nombre, email, password_hash, rol_id, categoria_id, activo) 
                    VALUES ($1, $2, $3, $4, $5, true) RETURNING *`;
      const result = await db.query(sql, [
        data.nombre, 
        data.email, 
        data.password_hash, 
        data.rol_id, 
        data.categoria_id || null
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  }

  async actualizarUsuario(id, data) {
    try {
      const sql = `UPDATE usuarios 
                    SET nombre = COALESCE($1, nombre),
                        email = COALESCE($2, email),
                        activo = COALESCE($3, activo),
                        rol_id = COALESCE($4, rol_id)
                    WHERE id = $5 AND activo = true RETURNING *`;
      const result = await db.query(sql, [
        data.nombre, 
        data.email, 
        data.activo, 
        data.rol_id, 
        id
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  }

  async eliminarUsuario(id) {
    try {
      const sql = `UPDATE usuarios SET activo = false WHERE id = $1`;
      const result = await db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  }

  async obtenerActivos() {
    try {
      const sql = `SELECT * FROM usuarios WHERE activo = true`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo usuarios activos:", error);
    }
  }

  async validarEmail(email) {
    try {
      const sql = `SELECT COUNT(*) as total FROM usuarios WHERE email = $1`;
      const result = await db.query(sql, [email]);
      return result.rows[0].total > 0;
    } catch (error) {
      console.error("Error validando email:", error);
    }
  }
}

module.exports = new UsuarioService();
