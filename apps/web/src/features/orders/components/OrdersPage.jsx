import { useEffect, useState } from "react";
import { useOrdersStore } from "../stores/useOrdersStore";
import { FaPlus, FaClock, FaCheck, FaTimes, FaBox } from "react-icons/fa";

const ESTADOS = {
  PENDIENTE: { 
    color: "text-yellow-400", 
    bg: "bg-yellow-500/20",
    icon: FaClock,
    label: "Pendiente"
  },
  EN_PROCESO: { 
    color: "text-blue-400", 
    bg: "bg-blue-500/20",
    icon: FaClock,
    label: "En Proceso"
  },
  COMPLETADO: { 
    color: "text-green-400", 
    bg: "bg-green-500/20",
    icon: FaCheck,
    label: "Completado"
  },
  CANCELADO: { 
    color: "text-red-400", 
    bg: "bg-red-500/20",
    icon: FaTimes,
    label: "Cancelado"
  }
};

const initialItem = { producto_id: "", cantidad: 1 };

export const OrdersPage = () => {
  const { 
    orders, 
    isLoading, 
    error, 
    fetchOrders, 
    createOrder, 
    updateOrderStatus, 
    clearError 
  } = useOrdersStore();

  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([{ ...initialItem }]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await createOrder({ items });
      setShowModal(false);
      setItems([{ ...initialItem }]);
    } catch {}
  };

  const addItem = () => setItems([...items, { ...initialItem }]);

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleChangeStatus = async (orderId, newEstado) => {
    await updateOrderStatus(orderId, newEstado);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Mis Pedidos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          <FaPlus /> Nuevo Pedido
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300">
            <FaTimes />
          </button>
        </div>
      )}

      {orders.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/40">
          <FaBox className="text-5xl mb-4" />
          <p className="text-lg">No tienes pedidos registrados</p>
          <p className="text-sm">Crea un nuevo pedido para comenzar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const estadoInfo = ESTADOS[order.estado] || ESTADOS.PENDIENTE;
            const EstadoIcon = estadoInfo.icon;

            return (
              <div 
                key={order.id} 
                className="bg-[#0c0c0c] p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-medium">
                      Pedido #{order.id?.slice(0, 8) || order.id}
                    </p>
                    <p className="text-white/50 text-sm">
                      {new Date(order.fecha).toLocaleString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${estadoInfo.bg}`}>
                    <EstadoIcon className={`text-xs ${estadoInfo.color}`} />
                    <span className={`text-xs font-medium ${estadoInfo.color}`}>
                      {estadoInfo.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 py-3 border-t border-b border-white/10">
                  {order.items?.length > 0 ? (
                    order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-white/70 text-sm">
                        <span>{item.producto_nombre || "Producto"}</span>
                        <span className="text-white/50">x{item.cantidad}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40 text-sm italic">Sin items</p>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-white/60 text-sm">Total</span>
                  <span className="text-white font-bold text-lg">
                    ${order.total?.toLocaleString() || "0"}
                  </span>
                </div>

                {order.estado === "PENDIENTE" && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => handleChangeStatus(order.id, "EN_PROCESO")}
                      className="flex-1 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 text-sm transition-colors"
                    >
                      Iniciar
                    </button>
                    <button
                      onClick={() => handleChangeStatus(order.id, "CANCELADO")}
                      className="flex-1 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 text-sm transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {order.estado === "EN_PROCESO" && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleChangeStatus(order.id, "COMPLETADO")}
                      className="w-full py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 text-sm transition-colors"
                    >
                      Marcar Completado
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] p-6 rounded-xl border border-white/10 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Nuevo Pedido</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white/40 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ID Producto"
                      value={item.producto_id}
                      onChange={(e) => updateItem(index, "producto_id", e.target.value)}
                      className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => updateItem(index, "cantidad", parseInt(e.target.value) || 1)}
                      className="w-20 p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
                      required
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={addItem}
                className="text-orange-400 text-sm hover:text-orange-300"
              >
                + Agregar producto
              </button>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Creando..." : "Crear Pedido"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};