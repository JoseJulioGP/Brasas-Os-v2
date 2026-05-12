
class BaseServiceImpl {
  constructor(query, tableName) {
    this.query = query;
    this.table = tableName;
  }

  async obtenerTodos(filtros = {}) {
    let sql = `SELECT * FROM ${this.table}`;
    let params = [];

    for (const [key, value] of Object.entries(filtros)) {
      if (value !== undefined && value !== null) {
        sql += ` WHERE ${key} = $${params.length + 1}`;
        params.push(value);
      }
    }

    const result = await this.query(sql, params);
    return result.rows;
  }

  async obtenerPorId(id) {
    const sql = `SELECT * FROM ${this.table} WHERE id = $1`;
    const result = await this.query(sql, [id]);
    return result.rows[0];
  }

  async crear(data) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data).map((v, i) => `$${i + 1}`).join(', ');
    
    const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${values}) RETURNING *`;
    
    const result = await this.query(sql, Object.values(data));
    return result.rows[0];
  }

  async actualizar(id, data) {
    const fields = Object.entries(data)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => `${key} = $${1 + Object.values(data).indexOf(value)}`);
    
    const fieldsSql = fields.join(', ');
    const values = Object.values(data);
    
    const sql = `UPDATE ${this.table} SET ${fieldsSql} WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);
    
    const result = await this.query(sql, values);
    return result.rows[0];
  }

  async eliminar(id) {
    const sql = `UPDATE ${this.table} SET activo = false WHERE id = $1`;
    const result = await this.query(sql, [id]);
    return result.rowCount > 0;
  }
}

module.exports = BaseServiceImpl;
