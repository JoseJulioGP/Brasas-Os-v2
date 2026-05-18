import { useEffect, useState } from "react";
import { FiPackage, FiRefreshCw } from "react-icons/fi";
import {
  FaBox,
  FaSearch,
  FaPlus,
  FaDrumstickBite,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import useInventoryStore from "../stores/useInventoryStore";
import InventoryCard from "./InventoryCard";
import InventoryModal from "./InventoryModal";

const TABS = [
  { id: "carnes", label: "Carnes", icon: FaDrumstickBite },
  { id: "insumos", label: "Insumos", icon: FiPackage },
  { id: "movimientos", label: "Movimientos", icon: FiRefreshCw },
];

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
      <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
    </div>
  </div>
);

const MovimientosTable = ({ movimientos }) => {
  if (movimientos.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <FiRefreshCw className="text-4xl text-white/20 mx-auto mb-4" />
        <p className="text-white/50 font-body">Sin movimientos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {movimientos.map((mov, i) => (
        <div
          key={mov.id || i}
          className="glass rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                mov.tipo === "ENTRADA"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {mov.tipo === "ENTRADA" ? <FaArrowDown /> : <FaArrowUp />}
            </div>
            <div>
              <p className="text-sm font-medium text-[#f5f0eb] font-body">
                {mov.producto_nombre || "Producto"}
              </p>
              <p className="text-xs text-white/30 font-body">
                {mov.tipo} · {mov.cantidad} {mov.unidad || ""}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 font-body">
              {mov.fecha
                ? new Date(mov.fecha).toLocaleDateString("es-CO")
                : ""}
            </p>
            <p className="text-xs text-white/30 font-body">{mov.usuario_nombre || ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const InventoryPage = () => {
  const {
    carnes,
    insumos,
    movimientos,
    isLoading,
    fetchAll,
    fetchMovimientos,
    addCarne,
    addInsumo,
  } = useInventoryStore();

  const [tab, setTab] = useState("carnes");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (tab === "movimientos") {
      fetchMovimientos();
    }
  }, [tab]);

  const filteredCarnes = (carnes || []).filter((i) =>
    i.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredInsumos = (insumos || []).filter((i) =>
    i.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (newItem) => {
    if (newItem.tipo === "carne" || newItem.categoria === "carnes") {
      await addCarne(newItem);
    } else {
      await addInsumo(newItem);
    }
  };

  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in-up opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaBox className="text-xl text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">
                Inventario
              </h1>
              <p className="text-sm text-white/40 font-body">
                Control de carnes, insumos y suministros
              </p>
            </div>
          </div>
          {tab !== "movimientos" && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body"
            >
              <FaPlus /> Agregar {tab === "carnes" ? "Carne" : "Insumo"}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 glass rounded-2xl w-fit animate-fade-in-up opacity-0 stagger-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 font-body ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400 shadow-sm"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon className="text-sm" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6 animate-fade-in-up opacity-0 stagger-2">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab?.label?.toLowerCase() || "producto"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body"
          />
        </div>

        {/* Content */}
        {isLoading && (tab !== "movimientos") ? (
          <Spinner />
        ) : tab === "carnes" ? filteredCarnes.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <FaDrumstickBite className="text-4xl text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-body">No hay carnes registradas</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up opacity-0 stagger-3">
            {filteredCarnes.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : tab === "insumos" ? filteredInsumos.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <FiPackage className="text-4xl text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-body">No hay insumos registrados</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up opacity-0 stagger-3">
            {filteredInsumos.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : tab === "movimientos" ? (
          <div className="animate-fade-in-up opacity-0 stagger-3">
            <MovimientosTable movimientos={movimientos || []} />
          </div>
        ) : null}
      </div>

      <InventoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};
