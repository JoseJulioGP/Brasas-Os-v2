import { FiSearch } from "react-icons/fi";
import { categorias } from "../utils/inventoryUtils";

const InventorySearch = ({ value, onChange, categoria, onCategoriaChange }) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up stagger-2 opacity-0">
    <div className="relative flex-1 max-w-md">
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
      <input
        type="text"
        placeholder="Buscar insumo..."
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/30 font-body outline-none transition-all duration-200 focus:border-orange-500/30"
      />
    </div>
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onCategoriaChange("")}
        className={`px-3 py-2 rounded-xl text-xs font-medium font-body transition-all duration-200 border ${
          categoria === "" ? "bg-orange-500/15 text-orange-400 border-orange-500/30" : "glass text-white/50 hover:text-white/70 hover:bg-white/[0.06] border-transparent"
        }`}
      >
        Todas
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoriaChange(cat.id)}
          className={`px-3 py-2 rounded-xl text-xs font-medium font-body transition-all duration-200 border ${
            categoria === cat.id ? `${cat.color} border-current` : "glass text-white/50 hover:text-white/70 hover:bg-white/[0.06] border-transparent"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  </div>
);

export default InventorySearch;
