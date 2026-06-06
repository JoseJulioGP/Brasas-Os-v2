const productosService = require('./productos.service');

const getProductos = async (req, res) => {
  try {
    const { categoria_id, limit, offset } = req.query;
    const productos = await productosService.getAll({ categoria_id, limit, offset, local_id: req.user.local_id });
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error getting productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productosService.getById(id, req.user.local_id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error getting producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createProducto = async (req, res) => {
  const { nombre, precio_venta, costo_produccion, categoria_id, insumos } = req.body;
  if (!nombre || !precio_venta) {
    return res.status(400).json({ message: 'Nombre y precio de venta son requeridos' });
  }
  if (costo_produccion && precio_venta && Number(costo_produccion) >= Number(precio_venta)) {
    return res.status(400).json({ message: 'El costo de producción no puede ser mayor o igual al precio de venta', warning: true });
  }
  try {
    const producto = await productosService.create({ nombre, precio_venta, costo_produccion, categoria_id, insumos, local_id: req.user.local_id });
    res.status(201).json(producto);
  } catch (error) {
    console.error('Error creating producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio_venta, costo_produccion, categoria_id, activo, insumos } = req.body;
  if (costo_produccion && precio_venta && Number(costo_produccion) >= Number(precio_venta)) {
    return res.status(400).json({ message: 'El costo de producción no puede ser mayor o igual al precio de venta', warning: true });
  }
  try {
    const producto = await productosService.update(id, { nombre, precio_venta, costo_produccion, categoria_id, activo, insumos }, req.user.local_id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error updating producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await productosService.delete(id, req.user.local_id);
    if (!resultado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProductosConCostos = async (req, res) => {
  try {
    const productos = await productosService.getAllWithCostos(req.user.local_id);
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error getting productos con costos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getCategorias = async (req, res) => {
  try {
    const categorias = await productosService.getCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    console.error('Error getting categorias:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ message: 'El nombre es requerido' });
  try {
    const categoria = await productosService.createCategoria(nombre.trim());
    res.status(201).json(categoria);
  } catch (error) {
    if (error.message === 'CATEGORIA_DUPLICADA') {
      return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error creating categoria:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productosService.deleteCategoria(id);
    if (!result) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.status(200).json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting categoria:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto, getProductosConCostos, getCategorias, createCategoria, deleteCategoria };
