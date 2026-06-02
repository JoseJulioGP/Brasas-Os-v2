const db = require("../../shared/database/db");
const bcrypt = require("bcrypt");
class UsersService {
    async createUser(nombre, email, password, rol_id = 3) {
        const existingUser = await db.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [email],
        );

        if (existingUser.rows.length > 0) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }
        const password_hash = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, creado_at)
            VALUES ($1, $2, $3, $4, true, NOW())
            RETURNING id, nombre, email, rol_id, activo`,
            [nombre, email, password_hash, rol_id],
        );
        const user = result.rows[0];
        const rolResult = await db.query("SELECT nombre FROM roles WHERE id = $1", [
            user.rol_id,
        ]);
        user.rol_nombre = rolResult.rows[0]?.nombre || "EMPLEADO";
        delete user.password_hash;
        return user;
    }
    async getUsers() {
        const result = await db.query(
            `SELECT u.id, u.nombre, u.email, u.activo, u.creado_at, r.nombre as rol_nombre
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.activo = true
            ORDER BY u.creado_at DESC`,
        );
        return result.rows;
    }
    async getUserById(id) {
        const result = await db.query(
            `SELECT u.id, u.nombre, u.email, u.activo, u.creado_at, r.nombre as rol_nombre
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = $1`,
            [id],
        );

        if (result.rows.length === 0) {
            throw new Error("USER_NOT_FOUND");
        }

        return result.rows[0];
    }
    async updateUser(id, { nombre, email, rol_id, activo }) {
        const existingUser = await this.getUserById(id);

        const updates = [];
        const values = [];
        let paramIndex = 1;
        if (nombre !== undefined) {
            updates.push(`nombre = $${paramIndex++}`);
            values.push(nombre);
        }
        if (email !== undefined && email !== existingUser.email) {
            const emailExists = await db.query(
                "SELECT id FROM usuarios WHERE email = $1 AND id != $2",
                [email, id],
            );
            if (emailExists.rows.length > 0) {
                throw new Error("EMAIL_ALREADY_EXISTS");
            }
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }
        if (rol_id !== undefined) {
            updates.push(`rol_id = $${paramIndex++}`);
            values.push(rol_id);
        }
        if (activo !== undefined) {
            updates.push(`activo = $${paramIndex++}`);
            values.push(activo);
        }
        if (updates.length === 0) {
            return existingUser;
        }
        values.push(id);
        const query = `UPDATE usuarios SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
        await db.query(query, values);
        return this.getUserById(id);
    }
    async deactivateUser(id) {
        const user = await this.getUserById(id);
        await db.query("UPDATE usuarios SET activo = false WHERE id = $1", [id]);
        return { message: "Usuario desactivado correctamente" };
    }

    async getCodigoInvitacion(userId) {
        const result = await db.query(
            "SELECT codigo_invitacion FROM usuarios WHERE id = $1",
            [userId]
        );
        return result.rows[0] || null;
    }

    async generarCodigoInvitacion(userId) {
        let codigo;
        let intentos = 0;
        do {
            codigo = String(Math.floor(100000 + Math.random() * 900000));
            const existe = await db.query(
                "SELECT id FROM usuarios WHERE codigo_invitacion = $1",
                [codigo]
            );
            if (existe.rows.length === 0) break;
            intentos++;
        } while (intentos < 10);

        const result = await db.query(
            "UPDATE usuarios SET codigo_invitacion = $1 WHERE id = $2 RETURNING codigo_invitacion",
            [codigo, userId]
        );
        return result.rows[0];
    }
}
module.exports = new UsersService();
