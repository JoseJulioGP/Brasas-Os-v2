import { useState, useRef, useEffect, useMemo } from "react";
import { FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";
import { useMenuStore } from "../../menu/stores/useMenuStore";

export const ProductSelector = ({ value, onChange }) => {
  const { items } = useMenuStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const ref = useRef(null);
  const searchRef = useRef(null);

  const selected = items.find((i) => i.id === value);

  // Categorías únicas
  const categorias = useMemo(() => {
    const cats = [...new Map(
      items.filter(i => i.categoria).map(i => [i.categoria_id, { id: i.categoria_id, nombre: i.categoria }])
    ).values()];
    return cats.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [items]);

  // Filtrado por búsqueda y/o categoría activa
  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchSearch = !search || i.nombre?.toLowerCase().includes(search.toLowerCase());
      const matchCat = !categoriaActiva || i.categoria_id === categoriaActiva;
      return matchSearch && matchCat;
    });
  }, [items, search, categoriaActiva]);

  // Agrupados por categoría para mostrar sin filtro activo
  const grupos = useMemo(() => {
    if (search || categoriaActiva) return null;
    const map = new Map();
    for (const item of items) {
      const key = item.categoria || "Sin categoría";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [items, search, categoriaActiva]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (id) => { onChange(id); setOpen(false); setSearch(""); setCategoriaActiva(null); };

  const handleClear = (e) => { e.stopPropagation(); onChange(null); };

  const renderItem = (item) => {
    const margen = item.precio_venta - (item.costo_produccion || 0);
    return (
      <button key={item.id} type="button"
        onClick={() => handleSelect(item.id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors ${value === item.id ? "bg-orange-500/10" : ""}`}
      >
        <div className="text-left">
          <p className="text-[#f5f0eb] font-body text-xs">{item.nombre}</p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-xs font-number text-[#f5f0eb]">${item.precio_venta?.toLocaleString()}</p>
          {item.costo_produccion != null && (
            <p className={`text-[10px] font-number ${margen > 0 ? "text-emerald-400/60" : "text-red-400/60"}`}>
              +${margen.toLocaleString()}
            </p>
          )}
        </div>
      </button>
    );
  };

  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 hover:border-white/[0.12] transition-colors"
      >
        {selected
          ? <span className="text-[#f5f0eb] font-body flex-1 truncate">{selected.nombre}</span>
          : <span className="text-white/20 font-body flex-1">Seleccionar plato...</span>
        }
        <div className="flex items-center gap-1 shrink-0">
          {selected && (
            <span onClick={handleClear} className="text-white/20 hover:text-white/50 transition-colors p-0.5">
              <FaTimes className="text-[10px]" />
            </span>
          )}
          <FaChevronDown className={`text-white/20 text-xs transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#111] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-fade-in" style={{ minWidth: "280px" }}>

          {/* Buscador */}
          <div className="p-2 border-b border-white/[0.04]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
              <input ref={searchRef} type="text" placeholder="Buscar plato..." value={search}
                onChange={(e) => { setSearch(e.target.value); setCategoriaActiva(null); }}
                className="w-full bg-white/[0.04] rounded-lg pl-8 pr-3 py-2 text-xs text-[#f5f0eb] placeholder:text-white/20 focus:outline-none font-body" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por categorías (solo si hay categorías y no hay búsqueda activa) */}
          {!search && categorias.length > 1 && (
            <div className="flex gap-1 px-2 py-1.5 border-b border-white/[0.04] overflow-x-auto scrollbar-none">
              <button
                onClick={() => setCategoriaActiva(null)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${!categoriaActiva ? "bg-orange-500/20 text-orange-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"}`}
              >
                Todos
              </button>
              {categorias.map(cat => (
                <button key={cat.id}
                  onClick={() => setCategoriaActiva(categoriaActiva === cat.id ? null : cat.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${categoriaActiva === cat.id ? "bg-orange-500/20 text-orange-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Lista de productos */}
          <div className="overflow-y-auto max-h-[260px]">
            {grupos ? (
              // Vista agrupada por categoría
              grupos.map(([categoria, catItems]) => (
                <div key={categoria}>
                  <p className="px-4 pt-2.5 pb-1 text-[9px] font-semibold tracking-widest uppercase text-white/20">
                    {categoria}
                  </p>
                  {catItems.map(renderItem)}
                </div>
              ))
            ) : filtered.length === 0 ? (
              <p className="p-4 text-xs text-white/30 text-center font-body">Sin resultados</p>
            ) : (
              filtered.map(renderItem)
            )}
          </div>
        </div>
      )}
    </div>
  );
};
