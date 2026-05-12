/**
 * IBaseService - Interface base para todas las operaciones CRUD
 * SRP: Solo se encarga de la estructura básica de operaciones
 */
class IBaseService {
  /**
   * SRP: Responsabilidad única - Obtener todos los registros
   * OCP: Abierto para extender filtros
   */
  obtenerTodos() {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

  /**
   * SRP: Obtener por ID - Respabilidad específica
   */
  obtenerPorId(id) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

  /**
   * SRP: Crear registro - Respabilidad específica
   */
  crear(data) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

  /**
   * SRP: Actualizar registro - Respabilidad específica
   */
  actualizar(id, data) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

  /**
   * SRP: Eliminar registro - Respabilidad específica
   */
  eliminar(id) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }
}

module.exports = IBaseService;
