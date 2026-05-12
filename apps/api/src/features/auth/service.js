const db = require('../shared/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * AutenticacionService - SRP: Única responsabilidad de autenticación
 * ISP: No implementa métodos CRUD genéricos
 */
class AutenticacionService {
    async iniciarSesion(email, password) {
        try {
            // 1. Buscar usuario por email (primero)
            const sql = `SELECT u.*, r.nombre as rol_nombre 
                    FROM usuarios u
                    JOIN roles r ON u.rol_id = r.id
                    WHERE u.email = $1 AND u.activo = true`;
            const result = await db.query(sql, [email]);

            const usuario = result.rows[0];
            if (!usuario) {
                throw new Error('CREDENTIALS_INVALID');
            }
            // 2. Comparar password con bcrypt (nunca en texto plano)
            const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
            if (!isPasswordValid) {
                throw new Error('CREDENTIALS_INVALID');
            }
            // 3. Generar JWT
            const token = jwt.sign(
                { id: usuario.id, rol: usuario.rol_nombre, iat: Date.now() },
                process.env.JWT_SECRET,
                { expiresIn: '30m' }
            );
            // 4. Crear sesión en BD
            await this.crearSesion(usuario.id, token, null, null);
            return {
                token,
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol_nombre
                }
            };
        } catch (error) {
            console.error("Error en autenticación:", error);
            if (error.message === 'CREDENTIALS_INVALID') {
                throw new Error("Credenciales incorrectas");
            }
            throw new Error("Error en el sistema");
        }
    }
    async crearSesion(usuarioId, token, ip, userAgent) {
        try {
            const sql = `INSERT INTO sesiones (usuario_id, token, expira_en, creado_at)
                    VALUES ($1, $2, NOW() + INTERVAL '30 minutes', NOW()) 
                    RETURNING *`;
            const result = await db.query(sql, [usuarioId, token]);
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
                WHERE s.usuario_id = $1 AND s.expira_en > NOW()
                ORDER BY s.creado_at DESC`;
            const result = await db.query(sql, [usuarioId]);
            return result.rows;
        } catch (error) {
            console.error("Error obteniendo sesiones:", error);
        }
    }
    async cerrarSesion(token) {
        try {
            const sql = `DELETE FROM sesiones WHERE token = $1`;
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
                    WHERE s.token = $1 AND s.expira_en > NOW()`;
            const result = await db.query(sql, [token]);
            return result.rows[0];
        } catch (error) {
            console.error("Error verificando token:", error);
            return null;
        }
    }
}
module.exports = new AutenticacionService();