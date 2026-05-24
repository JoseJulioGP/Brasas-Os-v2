const inventarioService = require('./inventario.service');

// === CARNES ===

const getCarnes = async (req, res) => {
  try {
    const carnes = await inventarioService.getCarnes();
    res.status(200).json(carnes);
  } catch (error) {
    console.error('Error getting carnes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getCarnesDisponibles = async (req, res) => {
  try {
    const carnes = await inventarioService.getCarnesDisponibles();
    res.status(200).json(carnes);
  } catch (error) {
    console.error('Error getting carnes disponibles:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createCarne = async (req, res) => {
  const { corte, kg_comprados, kg_disponibles, precio_por_kg, proveedor } = req.body;
  if (!corte || !kg_comprados || !precio_por_kg) {
    return res.status(400).json({ message: 'Corte, kg_comprados y precio_por_kg son requeridos' });
  }
  try {
    const carne = await inventarioService.createCarne({ corte, kg_comprados, kg_disponibles, precio_por_kg, proveedor });
    res.status(201).json(carne);
  } catch (error) {
    console.error('Error creating carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateCarne = async (req, res) => {
  const { id } = req.params;
  const { corte, kg_disponibles, precio_por_kg, proveedor } = req.body;
  try {
    const carne = await inventarioService.updateCarne(id, { corte, kg_disponibles, precio_por_kg, proveedor });
    if (!carne) return res.status(404).json({ message: 'Carne no encontrada' });
    res.status(200).json(carne);
  } catch (error) {
    console.error('Error updating carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// === INSUMOS ===

const getInsumos = async (req, res) => {
  try {
    const insumos = await inventarioService.getInsumos();
    res.status(200).json(insumos);
  } catch (error) {
    console.error('Error getting insumos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getInsumoById = async (req, res) => {
  const { id } = req.params;
  try {
    const insumo = await inventarioService.getInsumoById(id);
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error getting insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createInsumo = async (req, res) => {
  const { nombre, categoria, unidad_medida, stock_actual, stock_minimo } = req.body;
  if (!nombre || !unidad_medida) {
    return res.status(400).json({ message: 'Nombre y unidad_medida son requeridos' });
  }
  try {
    const insumo = await inventarioService.createInsumo({ nombre, categoria, unidad_medida, stock_actual, stock_minimo });
    res.status(201).json(insumo);
  } catch (error) {
    console.error('Error creating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateInsumo = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, unidad_medida, stock_actual, activo } = req.body;
  try {
    const insumo = await inventarioService.updateInsumo(id, { nombre, categoria, unidad_medida, stock_actual, activo });
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error updating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// T-23: solo ADMIN puede tocar stock_minimo — endpoint dedicado para que la ruta lo restrinja por rol
const updateStockMinimo = async (req, res) => {
  const { id } = req.params;
  const { stock_minimo } = req.body;
  if (stock_minimo == null || parseFloat(stock_minimo) < 0) {
    return res.status(400).json({ message: 'stock_minimo debe ser un número >= 0' });
  }
  try {
    const insumo = await inventarioService.updateStockMinimo(id, stock_minimo);
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error updating stock_minimo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// === MOVIMIENTOS ===

const getMovimientos = async (req, res) => {
  const { insumo_id, tipo, fecha_inicio, fecha_fin } = req.query;
  try {
    const movimientos = await inventarioService.getMovimientos({ insumo_id, tipo, fecha_inicio, fecha_fin });
    res.status(200).json(movimientos);
  } catch (error) {
    console.error('Error getting movimientos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// T-21: handlers semánticos — el tipo queda fijo en la ruta, el body no lo necesita
const createEntrada = async (req, res) => {
  const { insumo_id, cantidad, costo_unitario, motivo } = req.body;
  if (!insumo_id || !cantidad) {
    return res.status(400).json({ message: 'insumo_id y cantidad son requeridos' });
  }
  try {
    const resultado = await inventarioService.createMovimiento({
      insumo_id,
      usuario_id: req.user.id,
      tipo: 'entrada',
      cantidad,
      costo_unitario,
      motivo
    });
    res.status(201).json(resultado);
  } catch (error) {
    if (error.message === 'INSUMO_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    console.error('Error creating entrada:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createSalida = async (req, res) => {
  const { insumo_id, cantidad, motivo } = req.body;
  if (!insumo_id || !cantidad) {
    return res.status(400).json({ message: 'insumo_id y cantidad son requeridos' });
  }
  try {
    const resultado = await inventarioService.createMovimiento({
      insumo_id,
      usuario_id: req.user.id,
      tipo: 'salida',
      cantidad,
      motivo
    });
    res.status(201).json(resultado);
  } catch (error) {
    if (error.message === 'INSUMO_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    if (error.message === 'STOCK_INSUFICIENTE') {
      return res.status(400).json({ message: 'Stock insuficiente para realizar la salida' });
    }
    console.error('Error creating salida:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
const getProductoCarne = async (req, res) => {
  const { producto_id } = req.params;
  try {
    const config = await inventarioService.getProductoCarne(producto_id);
    if (!config) return res.status(404).json({ message: 'Este producto no tiene configuración de carne' });
    res.status(200).json(config);
  } catch (error) {
    console.error('Error getting producto_carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// T-32: crear o actualizar configuración de carne (ADMIN only)
const setProductoCarne = async (req, res) => {
  const { producto_id } = req.params;
  const { corte_ref, kg_requeridos } = req.body;

  if (!corte_ref || kg_requeridos == null || parseFloat(kg_requeridos) <= 0) {
    return res.status(400).json({ message: 'corte_ref y kg_requeridos (> 0) son requeridos' });
  }

  try {
    const config = await inventarioService.setProductoCarne(producto_id, corte_ref, kg_requeridos);
    res.status(200).json(config);
  } catch (error) {
    console.error('Error setting producto_carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getCarnes,
  getCarnesDisponibles,
  createCarne,
  updateCarne,
  getInsumos,
  getInsumoById,
  createInsumo,
  updateInsumo,
  updateStockMinimo,
  getMovimientos,
  createEntrada,
  createSalida,
  getProductoCarne,
  setProductoCarne
};
