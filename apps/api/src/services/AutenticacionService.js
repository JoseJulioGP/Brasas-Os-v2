import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class AutenticacionService {
  /**
   * Registro de nuevo usuario
   * @param {Object} userData - { nombre, email, password, rol_id }
   * @returns {Object} - Token JWT y usuario creado
   */
  async register(userData) {
    const saltRounds = 10;
    
    // Verificar si el usuario ya existe
    const existingUser = await query(
      "SELECT * FROM usuarios WHERE email = $1",
      [userData.email]
    );

    if (existingUser.rows.length > 0) {
      throw new ValidationError('El usuario ya existe', 400);
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Insertar usuario en la base de datos
    const result = await query(
      `INSERT INTO usuarios (
        nombre, email, password_hash, rol_id, activo
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nombre, email, activo, rol_id`,
      [
        userData.nombre,
        userData.email,
        hashedPassword,
        userData.rol_id || 1,
        true
      ]
    );

    const user = result.rows[0];

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return {
      user: { id: user.id, nombre: user.nombre, email: user.email },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    };
  }

  /**
   * Login de usuario
   * @param {Object} credentials - { email, password }
   * @returns {Object} - Token JWT
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Buscar usuario en la base de datos
    const userResult = await query(
      "SELECT * FROM usuarios WHERE email = $1 AND activo = true",
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new ValidationError('Credenciales incorrectas', 401);
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new ValidationError('Contraseña incorrecta', 401);
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return {
      user: { id: user.id, nombre: user.nombre, email: user.email },
      token
    };
  }

  /**
   * Obtener perfil de usuario actual (necesita autenticación)
   * @param {string} userId - ID del usuario
   * @returns {Object} - Usuario
   */
  async getProfile(userId) {
    const result = await query(
      "SELECT * FROM usuarios WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Usuario no encontrado', 404);
    }

    const user = result.rows[0];

    // No incluir la contraseña en el perfil
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Verificar si un token es válido
   * @param {string} token - Token JWT
   * @returns {Object} - Payload del token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ValidationError('Token inválido o expirado', 401);
    }
  }
}
