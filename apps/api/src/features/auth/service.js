const db = require("../../shared/database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**
 * AuthService - SRP: Única responsabilidad de autenticación
 * No usa tabla sesiones (stateless JWT)
 */
class AuthService {
  async login(email, password) {
    try {
      // 1. Buscar usuario por email
      const sql = `SELECT u.*, r.nombre as rol_nombre 
                    FROM usuarios u
                    JOIN roles r ON u.rol_id = r.id
                    WHERE u.email = $1 AND u.activo = true`;
      const result = await db.query(sql, [email]);
      const usuario = result.rows[0];
      if (!usuario) {
        throw new Error("CREDENTIALS_INVALID");
      }
      // 2. Comparar password con bcrypt
      const isPasswordValid = await bcrypt.compare(
        password,
        usuario.password_hash,
      );
      if (!isPasswordValid) {
        throw new Error("CREDENTIALS_INVALID");
      }
      // 3. Generar JWT (stateless)
      const token = jwt.sign(
        {
          id: usuario.id,
          rol: usuario.rol_nombre,
          email: usuario.email,
          iat: Date.now(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" },
      );
      // 4. Actualizar ultimo_acceso
      await db.query(
        "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1",
        [usuario.id],
      );
      return {
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol_nombre,
        },
      };
    } catch (error) {
      console.error("Error en autenticación:", error);
      if (error.message === "CREDENTIALS_INVALID") {
        throw new Error("Credenciales incorrectas");
      }
      throw new Error("Error en el sistema");
    }
  }
  async register(nombre, email, password) {
    try {
      // 1. Verificar si el email ya existe
      const existingUser = await db.query(
        "SELECT id FROM usuarios WHERE email = $1",
        [email],
      );
      if (existingUser.rows.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
      // 2. Hashear password
      const password_hash = await bcrypt.hash(password, 10);
      // 3. Obtener rol_id para EMPLEADO
      const rolResult = await db.query(
        "SELECT id FROM roles WHERE nombre = 'EMPLEADO'",
      );
      const rol_id = rolResult.rows[0]?.id;
      if (!rol_id) {
        throw new Error("ROLE_NOT_FOUND");
      }
      // 4. Crear usuario
      const result = await db.query(
        `INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, created_at)
                VALUES ($1, $2, $3, $4, true, NOW())
                RETURNING id, nombre, email, rol_id, activo`,
        [nombre, email, password_hash, rol_id],
      );
      const usuario = result.rows[0];
      usuario.rol_nombre = "EMPLEADO";
      // 5. Generar JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          rol: usuario.rol_nombre,
          email: usuario.email,
          iat: Date.now(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" },
      );
      return {
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol_nombre,
        },
      };
    } catch (error) {
      console.error("Error en registro:", error);
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        throw new Error("El email ya está registrado");
      }
      if (error.message === "ROLE_NOT_FOUND") {
        throw new Error("Error al asignar rol");
      }
      throw new Error("Error en el sistema");
    }
  }
}
module.exports = new AuthService();
