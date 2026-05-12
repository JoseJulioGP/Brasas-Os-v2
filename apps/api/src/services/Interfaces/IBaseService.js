
class IBaseService {
  
  obtenerTodos() {
    return Promise.reject('Método abstracto - debe ser implementado');
  }


  obtenerPorId(id) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

  
  crear(data) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

 
  actualizar(id, data) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }

  
  eliminar(id) {
    return Promise.reject('Método abstracto - debe ser implementado');
  }
}

module.exports = IBaseService;
