import { useState, useMemo, useRef, useEffect } from "react";
import { FaTimes, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaSearch, FaChevronDown } from "react-icons/fa";
import { useMenuStore } from "../../menu/stores/useMenuStore";

/* ── Selector de producto inline ── */
const ProductPicker = ({ value, onChange, usedIds }) => {
  const { items } = useMenuStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = items.find(i => i.id === value);

  const categorias = useMemo(() => {
    const cats = [...new Map(
      items.filter(i => i.categoria).map(i => [i.categoria_id, { id: i.categoria_id, nombre: i.categoria }])
    ).values()];
    return cats.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [items]);

  const disponibles = items.filter(i => !usedIds.includes(i.id));

  const filtered = useMemo(() =>
    disponibles.filter(i => {
      const matchSearch = !search || i.nombre?.toLowerCase().includes(search.toLowerCase());
      const matchCat = !categoriaActiva || i.categoria_id === categoriaActiva;
      return matchSearch && matchCat;
    }), [disponibles, search, categoriaActiva]
  );

  const grupos = useMemo(() => {
    if (search || categoriaActiva) return null;
    const map = new Map();
    for (const item of disponibles) {
      const key = item.categoria || "Sin categoría";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [disponibles, search, categoriaActiva]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (id) => { onChange(id); setOpen(false); setSearch(""); setCategoriaActiva(null); };

  const renderItem = (item) => (
    <button key={item.id} type="button"
      onClick={() => handleSelect(item.id)}
      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left">
      <p className="text-sm text-[#f5f0eb]">{item.nombre}</p>
      <p className="text-xs text-orange-400 font-mono shrink-0 ml-3">
        ${item.precio_venta?.toLocaleString("es-CO")}
      </p>
    </button>
  );

  if (selected) {
    return (
      <div className="flex-1 flex items-center justify-between bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5">
        <div>
          <p className="text-sm text-[#f5f0eb] font-medium">{selected.nombre}</p>
          <p className="text-xs text-white/35 font-mono">${selected.precio_venta?.toLocaleString("es-CO")}</p>
        </div>
        <button type="button" onClick={() => onChange("")}
          className="text-white/20 hover:text-white/60 transition-colors">
          <FaTimes className="text-xs" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex-1 relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 hover:border-white/[0.14] transition-colors focus:outline-none focus:border-orange-500/40">
        <span className="text-white/20">Seleccionar plato...</span>
        <FaChevronDown className={`text-white/20 text-xs transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-[#111] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden" style={{ width: "320px" }}>
          {/* Buscador */}
          <div className="p-2 border-b border-white/[0.04]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
              <input ref={inputRef} type="text" placeholder="Buscar plato..." value={search}
                onChange={e => { setSearch(e.target.value); setCategoriaActiva(null); }}
                className="w-full bg-white/[0.04] rounded-lg pl-8 pr-3 py-2 text-xs text-[#f5f0eb] placeholder:text-white/20 focus:outline-none" />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>
          </div>

          {/* Chips de categoría */}
          {!search && categorias.length > 1 && (
            <div className="flex gap-1 px-2 py-1.5 border-b border-white/[0.04] overflow-x-auto">
              <button type="button" onClick={() => setCategoriaActiva(null)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${!categoriaActiva ? "bg-orange-500/20 text-orange-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"}`}>
                Todos
              </button>
              {categorias.map(cat => (
                <button type="button" key={cat.id} onClick={() => setCategoriaActiva(categoriaActiva === cat.id ? null : cat.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${categoriaActiva === cat.id ? "bg-orange-500/20 text-orange-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"}`}>
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Lista */}
          <div className="overflow-y-auto max-h-[220px]">
            {grupos ? (
              grupos.map(([cat, catItems]) => (
                <div key={cat}>
                  <p className="px-4 pt-2.5 pb-1 text-[9px] font-semibold tracking-widest uppercase text-white/20">{cat}</p>
                  {catItems.map(renderItem)}
                </div>
              ))
            ) : filtered.length === 0 ? (
              <p className="p-4 text-xs text-white/30 text-center">Sin resultados</p>
            ) : (
              filtered.map(renderItem)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Modal ── */
export const OrderCreateModal = ({ isOpen, isLoading, onSubmit, onClose }) => {
  const { items: menuItems } = useMenuStore();
  const [lineas, setLineas] = useState([{ producto_id: "", cantidad: 1 }]);

  if (!isOpen) return null;

  const addLinea    = () => setLineas(p => [...p, { producto_id: "", cantidad: 1 }]);
  const removeLinea = (i) => { if (lineas.length > 1) setLineas(p => p.filter((_, idx) => idx !== i)); };
  const setProducto = (i, id)   => setLineas(p => p.map((l, idx) => idx === i ? { ...l, producto_id: id } : l));
  const setCantidad = (i, cant) => setLineas(p => p.map((l, idx) => idx === i ? { ...l, cantidad: Math.max(1, cant) } : l));

  const usedIds = lineas.map(l => l.producto_id).filter(Boolean);

  const total = lineas.reduce((sum, l) => {
    const item = menuItems.find(m => m.id === l.producto_id);
    return sum + (item ? item.precio_venta * l.cantidad : 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = lineas.filter(l => l.producto_id);
    if (filtered.length === 0) return;
    onSubmit(filtered);
    setLineas([{ producto_id: "", cantidad: 1 }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-4xl shadow-2xl shadow-black/60 animate-fade-in-up flex flex-col max-h-[92vh] min-h-[70vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FaShoppingCart className="text-blue-400 text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
                Nuevo Pedido
              </h2>
              <p className="text-xs text-white/30">Seleccioná los platos</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Líneas */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {lineas.map((linea, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <ProductPicker
                value={linea.producto_id}
                onChange={id => setProducto(idx, id)}
                usedIds={usedIds.filter(id => id !== linea.producto_id)}
              />

              {/* Cantidad */}
              <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-xl shrink-0 overflow-hidden">
                <button type="button" onClick={() => setCantidad(idx, linea.cantidad - 1)}
                  className="w-9 h-10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                  <FaMinus className="text-[10px]" />
                </button>
                <span className="w-8 text-center text-sm font-mono text-[#f5f0eb]">{linea.cantidad}</span>
                <button type="button" onClick={() => setCantidad(idx, linea.cantidad + 1)}
                  className="w-9 h-10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                  <FaPlus className="text-[10px]" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="w-20 shrink-0 flex flex-col items-end justify-center h-10">
                {linea.producto_id && (() => {
                  const item = menuItems.find(m => m.id === linea.producto_id);
                  return item ? (
                    <p className="text-xs font-mono text-white/50">
                      ${(item.precio_venta * linea.cantidad).toLocaleString("es-CO")}
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Eliminar */}
              {lineas.length > 1 && (
                <button type="button" onClick={() => removeLinea(idx)}
                  className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition-all shrink-0">
                  <FaTrash className="text-xs" />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addLinea}
            className="flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors mt-1">
            <FaPlus className="text-[9px]" /> Agregar otro plato
          </button>
        </form>

        {/* Footer con total */}
        <div className="px-6 py-4 border-t border-white/[0.06] shrink-0">
          {total > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/35 uppercase tracking-wider">Total estimado</span>
              <span className="text-lg font-bold text-[#f5f0eb] font-mono">
                ${total.toLocaleString("es-CO")}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={isLoading || !lineas.some(l => l.producto_id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-40 transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2">
              {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? "Creando..." : "Crear pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
