const pedidosService = require('./pedidos.service');

const createPedido = async (req, res) => {
  const { items } = req.body;
  const empleado_id = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'El pedido debe tener al menos un producto' });
  }

  // Fix Bug 4: validar formato de cada item
  for (const item of items) {
    if (!item.producto_id || !item.cantidad || item.cantidad <= 0) {
      return res.status(400).json({ message: 'Cada item debe tener producto_id y cantidad > 0' });
    }
  }

  try {
    const pedido = await pedidosService.createPedido(empleado_id, items);
    res.status(201).json(pedido);
  } catch (error) {
    if (error.message && error.message.includes('no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
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
      pedidos = await pedidosService.getPedidosByEmpleado(empleado_id, req.user.local_id);
    } else {
      pedidos = await pedidosService.getAllPedidos(req.user.local_id);
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
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

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

  const estadosValidos = ['pendiente', 'preparando', 'entregado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido. Valores permitidos: pendiente, preparando, entregado' });
  }

  try {
    const pedido = await pedidosService.getPedidoById(id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    if (rol === 'EMPLEADO' && pedido.empleado_id !== empleado_id) {
      return res.status(403).json({ message: 'No puedes modificar este pedido' });
    }

    // Fix Bug 2: bloquear transiciones desde estados finales
    if (pedido.estado === 'cancelado') {
      return res.status(400).json({ message: 'No se puede cambiar el estado de un pedido cancelado' });
    }
    if (pedido.estado === 'entregado') {
      return res.status(400).json({ message: 'No se puede cambiar el estado de un pedido completado' });
    }

    // Validar que no se retrocede
    const estadosOrden = { 'pendiente': 0, 'preparando': 1, 'entregado': 2 };
    if (estadosOrden[estado] < estadosOrden[pedido.estado]) {
      return res.status(400).json({ message: 'No puedes retroceder el estado del pedido' });
    }

    let pedidoActualizado;

    if (estado === 'entregado') {
      pedidoActualizado = await pedidosService.completarPedido(id, req.user.id, req.user.local_id);
    } else {
      pedidoActualizado = await pedidosService.updateEstado(id, estado);
    }

    res.status(200).json(pedidoActualizado);
  } catch (error) {
    if (error.message === 'PEDIDO_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    if (error.message && error.message.startsWith('STOCK_CARNE_INSUFICIENTE')) {
      const corte = error.message.split(':')[1];
      return res.status(409).json({
        message: `Stock insuficiente de carne: ${corte}. El pedido NO fue marcado como completado.`
      });
    }
    if (error.message && error.message.startsWith('STOCK_INSUMO_INSUFICIENTE')) {
      const insumo = error.message.split(':')[1];
      return res.status(409).json({
        message: `Stock insuficiente de insumo: ${insumo}. El pedido NO fue marcado como completado.`
      });
    }
    console.error('Error updating estado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getAllPedidos = async (req, res) => {
  const { fecha_inicio, fecha_fin, estado, empleado_id } = req.query;
  try {
    const pedidos = await pedidosService.getAllWithFilters({ fecha_inicio, fecha_fin, estado, empleado_id, local_id: req.user.local_id });
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error getting all pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updatePedido = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  // Fix Bug 3: validar items antes de llamar al service
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Se requiere al menos un item para actualizar el pedido' });
  }

  try {
    const pedido = await pedidosService.updatePedido(id, items);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error updating pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const cancelPedido = async (req, res) => {
  const { id } = req.params;
  const rol = req.user.rol;
  const empleado_id = req.user.id;

  try {
    const pedido = await pedidosService.getPedidoById(id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    if (rol === 'EMPLEADO' && pedido.empleado_id !== empleado_id) {
      return res.status(403).json({ message: 'No puedes cancelar este pedido' });
    }

    if (!['pendiente', 'preparando'].includes(pedido.estado)) {
      return res.status(400).json({ message: 'Solo se pueden cancelar pedidos pendientes o en preparación' });
    }

    const resultado = await pedidosService.cancelPedido(id, req.user.id, req.user.local_id);
    if (!resultado) return res.status(404).json({ message: 'Pedido no encontrado' });
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