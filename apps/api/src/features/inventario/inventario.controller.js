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

const createCarne = async (req, res) => {
  const { corte, kg_comprados, precio_por_kg, stock_minimo } = req.body;
  if (!corte || !kg_comprados || !precio_por_kg) {
    return res.status(400).json({ message: 'Corte, kg_comprados y precio_por_kg son requeridos' });
  }
  try {
    const carne = await inventarioService.createCarne({
      corte,
      kg_comprados: Number(kg_comprados),
      precio_por_kg: Number(precio_por_kg),
      stock_minimo: Number(stock_minimo) || 0,
    });
    res.status(201).json(carne);
  } catch (error) {
    console.error('Error creating carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateCarne = async (req, res) => {
  const { id } = req.params;
  const { corte, kg_disponibles, precio_por_kg, stock_minimo } = req.body;
  try {
    const carne = await inventarioService.updateCarne(id, { corte, kg_disponibles, precio_por_kg, stock_minimo });
    if (!carne) return res.status(404).json({ message: 'Carne no encontrada' });
    res.status(200).json(carne);
  } catch (error) {
    console.error('Error updating carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Devuelve los valores validos del enum tipo_insumo_enum
const getEnumTipos = async (req, res) => {
  try {
    const tipos = await inventarioService.getEnumTipos();
    res.status(200).json(tipos);
  } catch (error) {
    console.error('Error getting enum tipos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// === INSUMOS ===

const getInsumos = async (req, res) => {
  const { tipo } = req.query;
  try {
    const insumos = await inventarioService.getInsumos(tipo || null);
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
  const { nombre, categoria_id, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, local_id } = req.body;
  if (!nombre || !unidad_medida) {
    return res.status(400).json({ message: 'Nombre y unidad_medida son requeridos' });
  }
  try {
    const insumo = await inventarioService.createInsumo({
      nombre, categoria_id, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, local_id,
    });
    res.status(201).json(insumo);
  } catch (error) {
    console.error('Error creating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateInsumo = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria_id, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, activo } = req.body;
  try {
    const insumo = await inventarioService.updateInsumo(id, {
      nombre, categoria_id, tipo, unidad_medida, stock_actual, stock_minimo, costo_unitario_prom, activo,
    });
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error updating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateStockMinimo = async (req, res) => {
  const { id } = req.params;
  const { stock_minimo } = req.body;
  if (stock_minimo == null || parseFloat(stock_minimo) < 0) {
    return res.status(400).json({ message: 'stock_minimo debe ser >= 0' });
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

const createEntrada = async (req, res) => {
  const { insumo_id, cantidad, costo_unitario, motivo, proveedor_id } = req.body;
  if (!insumo_id || !cantidad) {
    return res.status(400).json({ message: 'insumo_id y cantidad son requeridos' });
  }
  try {
    const resultado = await inventarioService.createMovimiento({
      insumo_id, usuario_id: req.user.id, proveedor_id: proveedor_id || null,
      tipo: 'entrada', cantidad, costo_unitario, motivo,
    });
    res.status(201).json(resultado);
  } catch (error) {
    if (error.message === 'INSUMO_NO_ENCONTRADO') return res.status(404).json({ message: 'Insumo no encontrado' });
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
      insumo_id, usuario_id: req.user.id, tipo: 'salida', cantidad, motivo,
    });
    res.status(201).json(resultado);
  } catch (error) {
    if (error.message === 'INSUMO_NO_ENCONTRADO') return res.status(404).json({ message: 'Insumo no encontrado' });
    if (error.message === 'STOCK_INSUFICIENTE') return res.status(400).json({ message: 'Stock insuficiente' });
    console.error('Error creating salida:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getCarnes, createCarne, updateCarne, getEnumTipos,
  getInsumos, getInsumoById, createInsumo, updateInsumo, updateStockMinimo,
  getMovimientos, createEntrada, createSalida,
};
