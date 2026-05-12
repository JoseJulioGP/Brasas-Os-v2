const pedidosService = require('./pedidos.service');

const createPedido = async (req, res) => {
  const { items } = req.body;
  const empleado_id = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'El pedido debe tener al menos un producto' });
  }

  try {
    const pedido = await pedidosService.createPedido(empleado_id, items);
    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error creating pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getPedidos = async (req, res) => {
  const empleado_id = req.user.id;
  const rol = req.user.rol;

  try {
    let pedidos;
    if (rol === 'EMPLEADO') {
      pedidos = await pedidosService.getPedidosByEmpleado(empleado_id);
    } else {
      pedidos = await pedidosService.getAllPedidos();
    }
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error getting pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getPedidoById = async (req, res) => {
  const { id } = req.params;
  const empleado_id = req.user.id;
  const rol = req.user.rol;

  try {
    const pedido = await pedidosService.getPedidoById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Empleado solo puede ver sus propios pedidos
    if (rol === 'EMPLEADO' && pedido.empleado_id !== empleado_id) {
      return res.status(403).json({ message: 'No tienes acceso a este pedido' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error getting pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const empleado_id = req.user.id;
  const rol = req.user.rol;

  // Validar transición de estados (Pendiente → En Proceso → Completado)
  const estadosValidos = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    const pedido = await pedidosService.getPedidoById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Empleado solo puede cambiar estado de sus propios pedidos
    if (rol === 'EMPLEADO' && pedido.empleado_id !== empleado_id) {
      return res.status(403).json({ message: 'No puedes modificar este pedido' });
    }

    // Validar que no se puede retroceder en el estado
    const estadosOrden = { 'PENDIENTE': 0, 'EN_PROCESO': 1, 'COMPLETADO': 2 };
    if (estadosOrden[estado] < estadosOrden[pedido.estado]) {
      return res.status(400).json({ message: 'No puedes retroceder el estado del pedido' });
    }

    const pedidoActualizado = await pedidosService.updateEstado(id, estado);
    
    // Si se completa, descontar stock
    if (estado === 'COMPLETADO') {
      await pedidosService.descontarStock(id);
    }

    res.status(200).json(pedidoActualizado);
  } catch (error) {
    console.error('Error updating estado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getAllPedidos = async (req, res) => {
  const { fecha_inicio, fecha_fin, estado, empleado_id } = req.query;
  
  try {
    const pedidos = await pedidosService.getAllWithFilters({ fecha_inicio, fecha_fin, estado, empleado_id });
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error getting all pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updatePedido = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const pedido = await pedidosService.updatePedido(id, items);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error updating pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const cancelPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pedidosService.cancelPedido(id);
    if (!resultado) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.status(200).json({ message: 'Pedido cancelado correctamente' });
  } catch (error) {
    console.error('Error canceling pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createPedido,
  getPedidos,
  getPedidoById,
  updateEstado,
  getAllPedidos,
  updatePedido,
  cancelPedido
};