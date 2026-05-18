import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useMenuStore } from "../../menu/stores/useMenuStore";

export const ProductSelector = ({ value, onChange }) => {
  const { items } = useMenuStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selected = items.find((i) => i.id === value);
  const filtered = items.filter((i) => i.nombre?.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 hover:border-white/[0.12] transition-colors"
      >
        {selected ? <span className="text-[#f5f0eb] font-body">{selected.nombre}</span> : <span className="text-white/20 font-body">Seleccionar plato...</span>}
        <FaChevronDown className={`text-white/20 text-xs transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 glass rounded-xl border border-white/[0.06] shadow-2xl max-h-[240px] overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-white/[0.04]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
              <input type="text" placeholder="Buscar plato..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] rounded-lg pl-8 pr-3 py-2 text-xs text-[#f5f0eb] placeholder:text-white/20 focus:outline-none font-body" autoFocus />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[180px]">
            {filtered.length === 0 ? (
              <p className="p-4 text-xs text-white/30 text-center font-body">Sin resultados</p>
            ) : (
              filtered.map((item) => {
                const margen = item.precio_venta - (item.costo_produccion || 0);
                return (
                  <button key={item.id} type="button"
                    onClick={() => { onChange(item.id); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors ${value === item.id ? "bg-orange-500/10" : ""}`}
                  >
                    <div className="text-left">
                      <p className="text-[#f5f0eb] font-body text-xs">{item.nombre}</p>
                      {item.categoria && <p className="text-[10px] text-white/30 font-body">{item.categoria}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-number text-[#f5f0eb]">${item.precio_venta?.toLocaleString()}</p>
                      {item.costo_produccion != null && (
                        <p className={`text-[10px] font-number ${margen > 0 ? "text-emerald-400/60" : "text-red-400/60"}`}>
                          {margen > 0 ? "+" : ""}${margen.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
