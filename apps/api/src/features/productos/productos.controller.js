const productosService = require('./productos.service');

const CAMPOS_FINANCIEROS = ['costo_produccion', 'margen', 'porcentaje_margen'];

function filtrarPorRol(producto, rol) {
  if (rol !== 'EMPLEADO') return producto;
  const resultado = { ...producto };
  CAMPOS_FINANCIEROS.forEach(campo => delete resultado[campo]);
  return resultado;
}

function tieneAlertaMargen(costo_produccion, precio_venta) {
  return costo_produccion != null && precio_venta != null &&
    parseFloat(costo_produccion) >= parseFloat(precio_venta);
}

const getProductos = async (req, res) => {
  try {
    const filtros = {
      categoria: req.query.categoria,
      limit: req.query.limit,
      offset: req.query.offset
    };
    const resultado = await productosService.getAll(filtros);
    resultado.data = resultado.data.map(p => filtrarPorRol(p, req.user.rol));
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error getting productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productosService.getById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(filtrarPorRol(producto, req.user.rol));
  } catch (error) {
    console.error('Error getting producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createProducto = async (req, res) => {
  const { nombre, precio_venta, costo_produccion, categoria } = req.body;

  if (!nombre || precio_venta == null) {
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  }

  try {
    const producto = await productosService.create({
      nombre,
      precio_venta,
      costo_produccion,
      categoria
    });
    // T-16: alerta si costo >= precio, pero no bloquea la operación
    const response = { ...producto };
    if (tieneAlertaMargen(producto.costo_produccion, producto.precio_venta)) {
      response.alerta_margen = true;
    }
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio_venta, costo_produccion, categoria, activo } = req.body;

  try {
    const producto = await productosService.update(id, {
      nombre,
      precio_venta,
      costo_produccion,
      categoria,
      activo
    });
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    // T-16: alerta si costo >= precio, pero no bloquea la operación
    const response = { ...producto };
    if (tieneAlertaMargen(producto.costo_produccion, producto.precio_venta)) {
      response.alerta_margen = true;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await productosService.delete(id);
    if (!resultado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProductosConCostos = async (req, res) => {
  try {
    const productos = await productosService.getAllWithCostos();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error getting productos con costos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosConCostos
};