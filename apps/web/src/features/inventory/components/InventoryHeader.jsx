import { FiPlus } from "react-icons/fi";

const InventoryHeader = ({ onAdd }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up stagger-1 opacity-0">
    <div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#f5f0eb] mb-2">Inventario</h1>
      <p className="text-white/50 font-body">Control de stock de insumos y suministros</p>
    </div>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium font-body text-sm transition-all duration-200 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
    >
      <FiPlus className="text-base" />
      Agregar Insumo
    </button>
  </div>
);

export default InventoryHeader;
