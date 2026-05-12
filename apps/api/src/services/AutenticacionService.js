const db = require('../shared/database');

class AutenticacionService {
  async iniciarSesion(email, password) {
    try {
      const sql = `SELECT u.*, r.nombre as rol_nombre 
                    FROM usuarios u
                    JOIN roles r ON u.rol_id = r.id
                    WHERE u.email = $1 AND u.password_hash = $2 AND u.activo = true`;
      const result = await db.query(sql, [email, password]);
      return result.rows[0];
    } catch (error) {
      console.error("Error en autenticación:", error);
      throw new Error("Credenciales incorrectas");
    }
  }

  async crearSesion(usuarioId, token, ip, userAgent) {
    try {
      const sql = `INSERT INTO sesiones (usuario_id, token, ip, user_agent, activo, fecha_inicio) 
                    VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP) 
                    RETURNING *`;
      const result = await db.query(sql, [usuarioId, token, ip, userAgent]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando sesión:", error);
    }
  }

  async obtenerSesionesActivas(usuarioId) {
    try {
      const sql = `SELECT s.*, u.nombre as usuario_nombre 
                    FROM sesiones s
                    JOIN usuarios u ON s.usuario_id = u.id
                    WHERE s.usuario_id = $1 AND s.activo = true
                    ORDER BY s.fecha_inicio DESC`;
      const result = await db.query(sql, [usuarioId]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo sesiones:", error);
    }
  }

  async cerrarSesion(token) {
    try {
      const sql = `UPDATE sesiones SET activo = false WHERE token = $1`;
      const result = await db.query(sql, [token]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

  async verificarToken(token) {
    try {
      const sql = `SELECT s.*, u.id as usuario_id, u.nombre, r.nombre as rol
                    FROM sesiones s
                    JOIN usuarios u ON s.usuario_id = u.id
                    JOIN roles r ON u.rol_id = r.id
                    WHERE s.token = $1 AND s.activo = true`;
      const result = await db.query(sql, [token]);
      return result.rows[0];
    } catch (error) {
      console.error("Error verificando token:", error);
      return null;
    }
  }

  async validarRol(usuarioId, rolRequerido) {
    try {
      const sql = `SELECT r.nombre, r.permisos
                    FROM usuarios u
                    JOIN roles r ON u.rol_id = r.id
                    WHERE u.id = $1`;
      const result = await db.query(sql, [usuarioId]);
      const usuario = result.rows[0];
      
      if (!usuario) return false;
      
      const tienePermiso = usuario.rol.permisos.some(p => p === rolRequerido);
      return tienePermiso;
    } catch (error) {
      console.error("Error validando rol:", error);
    }
  }
}

module.exports = new AutenticacionService();
