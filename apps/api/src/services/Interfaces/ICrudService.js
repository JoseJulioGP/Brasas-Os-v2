/**
 * ICrudService - Interface para servicios CRUD completos
 * ISP: Solo se implementa si se necesita el CRUD completo
 */
class ICrudService extends IBaseService {
  constructor(query) {
    super();
    this.query = query;
    this.table = null;
  }

  /**
   * OCP: Abierto para extender con nuevos filtros
   */
  obtenerTodos(filtros = {}) {
    return this.query.getAll(this.table, filtros);
  }

  obtenerPorId(id) {
    return this.query.getById(this.table, id);
  }

  crear(data) {
    return this.query.create(this.table, data);
  }

  actualizar(id, data) {
    return this.query.update(this.table, id, data);
  }

  eliminar(id) {
    return this.query.delete(this.table, id);
  }
}

module.exports = ICrudService;
