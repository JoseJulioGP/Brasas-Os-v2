import { FaSearch } from "react-icons/fa";

export const OrderFilters = ({ search, onSearchChange, estado, onEstadoChange }) => (
  <div className="glass rounded-2xl p-4 mb-6 animate-fade-in-up opacity-0 stagger-1">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
        <input type="text" placeholder="Buscar por ID..." value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body" />
      </div>
      <select value={estado} onChange={(e) => onEstadoChange(e.target.value)}
        className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-orange-500/30 transition-colors font-body">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="preparando">En Proceso</option>
        <option value="entregado">Completado</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </div>
  </div>
);
