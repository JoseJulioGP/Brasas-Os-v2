
class ISecurityService {

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
