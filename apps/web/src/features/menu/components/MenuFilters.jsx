import { FaSearch } from "react-icons/fa";

export const MenuFilters = ({ search, onSearchChange, categoria, onCategoriaChange, categorias = [] }) => {
  const tabs = [{ id: "", nombre: "Todas" }, ...categorias];

  return (
    <div className="glass rounded-2xl p-4 mb-6 animate-fade-in-up opacity-0 stagger-1">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
          <input type="text" placeholder="Buscar plato..." value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((cat) => (
            <button key={cat.id} onClick={() => onCategoriaChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all font-body ${
                categoria === cat.id
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "text-white/40 hover:text-white/70 bg-white/[0.04] border border-transparent"
              }`}>
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
