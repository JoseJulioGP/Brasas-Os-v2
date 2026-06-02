const inventarioService = require('./inventario.service');

// === INSUMOS ===

const getInsumos = async (req, res) => {
  try {
    const insumos = await inventarioService.getInsumos(req.user.local_id);
    res.status(200).json(insumos);
  } catch (error) {
    console.error('Error getting insumos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getInsumoById = async (req, res) => {
  const { id } = req.params;
  try {
    const insumo = await inventarioService.getInsumoById(id, req.user.local_id);
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error getting insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createInsumo = async (req, res) => {
  const { nombre, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom } = req.body;
  if (!nombre || !unidad_medida) {
    return res.status(400).json({ message: 'Nombre y unidad_medida son requeridos' });
  }
  try {
    const insumo = await inventarioService.createInsumo({
      nombre, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom,
      local_id: req.user.local_id,
    });
    res.status(201).json(insumo);
  } catch (error) {
    console.error('Error creating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateInsumo = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, unidad_medida, stock_actual, costo_unitario_prom, activo } = req.body;
  try {
    const insumo = await inventarioService.updateInsumo(id, {
      nombre, tipo, unidad_medida, stock_actual, costo_unitario_prom, activo,
    }, req.user.local_id);
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error updating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// T-23: solo ADMIN puede tocar stock_minimo
const updateStockMinimo = async (req, res) => {
  const { id } = req.params;
  const { stock_minimo } = req.body;
  if (stock_minimo == null || parseFloat(stock_minimo) < 0) {
    return res.status(400).json({ message: 'stock_minimo debe ser un número >= 0' });
  }
  try {
    const insumo = await inventarioService.updateStockMinimo(id, stock_minimo, req.user.local_id);
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
    const movimientos = await inventarioService.getMovimientos({ insumo_id, tipo, fecha_inicio, fecha_fin, local_id: req.user.local_id });
    res.status(200).json(movimientos);
  } catch (error) {
    console.error('Error getting movimientos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createEntrada = async (req, res) => {
  const { insumo_id, cantidad, costo_unitario, motivo } = req.body;
  if (!insumo_id || !cantidad) {
    return res.status(400).json({ message: 'insumo_id y cantidad son requeridos' });
  }
  try {
    const resultado = await inventarioService.createMovimiento({
      insumo_id,
      usuario_id: req.user.id,
      local_id: req.user.local_id,
      tipo: 'entrada',
      cantidad,
      costo_unitario,
      motivo,
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
      local_id: req.user.local_id,
      tipo: 'salida',
      cantidad,
      motivo,
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

module.exports = {
  getInsumos,
  getInsumoById,
  createInsumo,
  updateInsumo,
  updateStockMinimo,
  getMovimientos,
  createEntrada,
  createSalida,
};
