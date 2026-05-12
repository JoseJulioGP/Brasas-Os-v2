const inventarioService = require('./inventario.service');

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
    console.error('Error getting carnes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createCarne = async (req, res) => {
  const { corte, kg_comprados, kg_disponibles, precio_por_kg, proveedor } = req.body;

  if (!corte || !kg_comprados || !precio_por_kg) {
    return res.status(400).json({ message: 'Corte, kg comprados y precio son requeridos' });
  }

  try {
    const carne = await inventarioService.createCarne({
      corte,
      kg_comprados,
      kg_disponibles: kg_disponibles || kg_comprados,
      precio_por_kg,
      proveedor
    });
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
    if (!carne) {
      return res.status(404).json({ message: 'Carne no encontrada' });
    }
    res.status(200).json(carne);
  } catch (error) {
    console.error('Error updating carne:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getInsumos = async (req, res) => {
  try {
    const insumos = await inventarioService.getInsumos();
    res.status(200).json(insumos);
  } catch (error) {
    console.error('Error getting insumos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createInsumo = async (req, res) => {
  const { nombre, categoria, unidad_medida, stock_actual, stock_minimo } = req.body;

  if (!nombre || !unidad_medida) {
    return res.status(400).json({ message: 'Nombre y unidad de medida son requeridos' });
  }

  try {
    const insumo = await inventarioService.createInsumo({
      nombre,
      categoria,
      unidad_medida,
      stock_actual: stock_actual || 0,
      stock_minimo: stock_minimo || 0
    });
    res.status(201).json(insumo);
  } catch (error) {
    console.error('Error creating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateInsumo = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, unidad_medida, stock_actual, stock_minimo, activo } = req.body;

  try {
    const insumo = await inventarioService.updateInsumo(id, {
      nombre, categoria, unidad_medida, stock_actual, stock_minimo, activo
    });
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error updating insumo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

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

const createMovimiento = async (req, res) => {
  const { insumo_id, tipo, cantidad, costo_unitario, motivo } = req.body;

  if (!insumo_id || !tipo || !cantidad) {
    return res.status(400).json({ message: 'Insumo, tipo y cantidad son requeridos' });
  }

  try {
    const movimiento = await inventarioService.createMovimiento({
      insumo_id,
      usuario_id: req.user.id,
      tipo,
      cantidad,
      costo_unitario,
      motivo
    });
    res.status(201).json(movimiento);
  } catch (error) {
    console.error('Error creating movimiento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getCarnes,
  getCarnesDisponibles,
  createCarne,
  updateCarne,
  getInsumos,
  createInsumo,
  updateInsumo,
  getMovimientos,
  createMovimiento
};