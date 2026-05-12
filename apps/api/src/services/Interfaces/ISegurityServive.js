/**
 * ISecurityService - Interface para operaciones de seguridad
 * ISP: Segregada porque no todas las tablas necesitan seguridad
 */
class ISecurityService {
  /**
   * SRP: Solo se encarga de autenticación y autorización
   */
  verificarToken(token) {
    return Promise.reject('Método abstracto');
  }

  cerrarSesion(token) {
    return Promise.reject('Método abstracto');
  }

  obtenerPermisos(usuarioId) {
    return Promise.reject('Método abstracto');
  }

  crearSesion(data) {
    return Promise.reject('Método abstracto');
  }
}

module.exports = ISecurityService;
