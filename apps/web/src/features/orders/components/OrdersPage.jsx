import { useEffect, useState } from "react";
import { useAuthStore } from "../../auth/stores/useAuthStore";
import { useOrdersStore } from "../stores/useOrdersStore";
import { useMenuStore } from "../../menu/stores/useMenuStore";
import { FaPlus, FaTimes, FaBox, FaShoppingCart } from "react-icons/fa";
import { OrderFilters } from "./OrderFilters";
import { OrderCard } from "./OrderCard";
import { OrderCreateModal } from "./OrderCreateModal";

export const OrdersPage = () => {
  const user = useAuthStore((s) => s.user);
  const { orders, isLoading, error, fetchOrders, fetchAllOrders, createOrder, updateOrderStatus, cancelOrder, clearError } = useOrdersStore();
  const { items: menuItems, fetchAll: fetchMenu } = useMenuStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const isAdminOrJefe = user?.rol === "ADMIN" || user?.rol === "JEFE";

  useEffect(() => {
    if (isAdminOrJefe) fetchAllOrders();
    else fetchOrders();
  }, []);

  useEffect(() => {
    if (showModal && menuItems.length === 0) fetchMenu();
  }, [showModal]);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.id?.toLowerCase().includes(search.toLowerCase());
    const matchEstado = !estadoFilter || o.estado === estadoFilter;
    return matchSearch && matchEstado;
  });

  const handleCreateOrder = async (items) => {
    try {
      await createOrder({ items });
      setShowModal(false);
    } catch {}
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaShoppingCart className="text-xl text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">
                {isAdminOrJefe ? "Pedidos" : "Mis Pedidos"}
              </h1>
              <p className="text-sm text-white/40 font-body">
                {isAdminOrJefe ? "Gestión de todos los pedidos" : "Tus pedidos registrados"}
              </p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body">
            <FaPlus /> Nuevo Pedido
          </button>
        </div>

        <OrderFilters search={search} onSearchChange={setSearch} estado={estadoFilter} onEstadoChange={setEstadoFilter} />

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-4"><FaTimes /></button>
          </div>
        )}

        {isLoading && orders.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FaBox className="text-5xl text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-body text-lg">
              {search || estadoFilter ? "No se encontraron pedidos" : "No hay pedidos registrados"}
            </p>
            <p className="text-white/20 text-sm font-body mt-1">Crea un nuevo pedido para comenzar</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up opacity-0 stagger-2">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} onCancel={user?.rol === "ADMIN" ? cancelOrder : undefined} />
            ))}
          </div>
        )}
      </div>

      <OrderCreateModal isOpen={showModal} isLoading={isLoading} onSubmit={handleCreateOrder} onClose={() => setShowModal(false)} />
    </div>
  );
};
