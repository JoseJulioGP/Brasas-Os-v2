const productosService = require('./productos.service');

<<<<<<< Updated upstream
=======
// SRP: El controlador solo maneja HTTP, extrae datos y valida
// La lógica de negocio está en el service

>>>>>>> Stashed changes
const getProductos = async (req, res) => {
  try {
    const productos = await productosService.getAll();
    res.status(200).json(productos);
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
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error getting producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createProducto = async (req, res) => {
  const { nombre, precio_venta, costo_produccion, categoria } = req.body;

  if (!nombre || !precio_venta) {
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  }

<<<<<<< Updated upstream
  try {
    const producto = await productosService.create({ nombre, precio_venta, costo_produccion, categoria });
=======
  // Validación de negocio: costo no debe superar precio
  if (costo_produccion && precio_venta && costo_produccion >= precio_venta) {
    return res.status(400).json({ 
      message: 'El costo de producción no puede ser mayor o igual al precio de venta',
      warning: true
    });
  }

  try {
    const producto = await productosService.create({ 
      nombre, 
      precio_venta, 
      costo_produccion, 
      categoria 
    });
>>>>>>> Stashed changes
    res.status(201).json(producto);
  } catch (error) {
    console.error('Error creating producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio_venta, costo_produccion, categoria, activo } = req.body;

<<<<<<< Updated upstream
  try {
    const producto = await productosService.update(id, { nombre, precio_venta, costo_produccion, categoria, activo });
=======
  // Validación de negocio
  if (costo_produccion && precio_venta && costo_produccion >= precio_venta) {
    return res.status(400).json({ 
      message: 'El costo de producción no puede ser mayor o igual al precio de venta',
      warning: true
    });
  }

  try {
    const producto = await productosService.update(id, { 
      nombre, 
      precio_venta, 
      costo_produccion, 
      categoria, 
      activo 
    });
>>>>>>> Stashed changes
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
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