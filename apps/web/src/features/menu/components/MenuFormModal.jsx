import { useState, useEffect } from "react";
import { FaTimes, FaUtensils, FaPlus, FaTrash, FaSearch, FaChevronDown } from "react-icons/fa";

const inputCls  = "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const Field = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium tracking-wider uppercase text-white/35">
      {label}{required && <span className="text-orange-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-white/20">{hint}</p>}
  </div>
);

const initialInsumo = { insumo_id: "", cantidad_requerida: 1 };

// Selector inline — se expande dentro del flujo normal, sin posicionamiento flotante
const InsumoSelector = ({ value, allInsumos, onChange }) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const seleccionado        = allInsumos.find(i => i.id === value);

  const filtrados = (allInsumos || []).filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase()) ||
    i.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => { onChange(id); setOpen(false); setSearch(""); };

  return (
    <div className="flex-1 min-w-0">
      {/* Botón principal */}
      {!open ? (
        <button type="button" onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-xs text-left transition-all hover:border-orange-500/30">
          {seleccionado ? (
            <span className="text-[#f5f0eb] truncate">
              {seleccionado.nombre}
              <span className="text-white/30 ml-1">({seleccionado.unidad_medida})</span>
            </span>
          ) : (
            <span className="text-white/25">Seleccionar insumo...</span>
          )}
          <FaChevronDown className="text-white/20 text-[9px] shrink-0 ml-1" />
        </button>
      ) : (
        /* Cuando está abierto: input de búsqueda + lista inline */
        <div className="border border-orange-500/30 rounded-xl overflow-hidden bg-[#141413]">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
            <FaSearch className="text-white/20 text-[10px] shrink-0" />
            <input autoFocus type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setOpen(false)}
              placeholder="Buscar insumo..."
              className="flex-1 bg-transparent text-xs text-[#f5f0eb] placeholder:text-white/20 outline-none" />
            <button type="button" onClick={() => { setOpen(false); setSearch(""); }}
              className="text-white/25 hover:text-white/60 transition-colors">
              <FaTimes className="text-[9px]" />
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filtrados.length === 0 ? (
              <p className="text-center text-xs text-white/25 py-3">Sin resultados</p>
            ) : filtrados.map(i => (
              <button key={i.id} type="button" onClick={() => handleSelect(i.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors hover:bg-white/[0.05] ${
                  value === i.id ? "bg-orange-500/10 text-orange-400" : "text-[#f5f0eb]"
                }`}>
                <span className="truncate">{i.nombre}</span>
                <span className="text-white/25 shrink-0 ml-2 text-[10px]">{i.unidad_medida} · {i.tipo}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MenuFormModal = ({ isOpen, editing, isLoading, allInsumos, categorias, onSubmit, onClose }) => {
  const [form, setForm]       = useState({ nombre: "", precio_venta: "", categoria_id: "" });
  const [insumos, setInsumos] = useState([]);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        nombre:       editing.nombre             || "",
        precio_venta: editing.precio_venta?.toString() || "",
        categoria_id: editing.categoria_id       || "",
      });
      setInsumos((editing.insumos || []).map(i => ({
        insumo_id:          i.insumo_id,
        cantidad_requerida: i.cantidad_requerida,
      })));
    } else {
      setForm({ nombre: "", precio_venta: "", categoria_id: "" });
      setInsumos([]);
    }
    setError("");
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const insumosValidos = insumos.filter(i => i.insumo_id);
    if (insumosValidos.length === 0) {
      setError("Debés agregar al menos un insumo antes de guardar el producto.");
      return;
    }
    setError("");
    onSubmit({
      nombre:       form.nombre,
      precio_venta: Number(form.precio_venta),
      categoria_id: form.categoria_id || null,
      insumos:      insumosValidos,
    });
  };

  const addInsumo    = () => setInsumos(p => [...p, { ...initialInsumo }]);
  const removeInsumo = (i) => setInsumos(p => p.filter((_, idx) => idx !== i));
  const updateInsumo = (i, k, v) => setInsumos(p => p.map((ins, idx) => idx === i ? { ...ins, [k]: v } : ins));
  const getInsumo    = (id) => (allInsumos || []).find(i => i.id === id);
  const getUnidad    = (id) => getInsumo(id)?.unidad_medida || "";
  const isUnidad     = (id) => getInsumo(id)?.unidad_medida === "unidad";

  const margenEstimado = form.precio_venta && editing?.costo_produccion
    ? (Number(form.precio_venta) - editing.costo_produccion).toLocaleString("es-CO")
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/60 animate-fade-in-up max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaUtensils className="text-orange-400 text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <p className="text-xs text-white/30">
                {editing ? `Modificando "${editing.nombre}"` : "Agregar al menú"}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Body en dos columnas */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">

            {/* Columna izquierda — datos del producto */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs font-medium tracking-wider uppercase text-white/35">Datos del producto</p>

              <Field label="Nombre" required>
                <input type="text" value={form.nombre}
                  onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                  placeholder="Ej: Chuleta, Limonada de coco..."
                  className={inputCls} required autoFocus />
              </Field>

              <Field label="Categoría">
                <select value={form.categoria_id}
                  onChange={e => setForm(p => ({ ...p, categoria_id: e.target.value }))}
                  className={selectCls}>
                  <option value="" className="bg-[#0f0f0e]">Sin categoría</option>
                  {(categorias || []).map(c => (
                    <option key={c.id} value={c.id} className="bg-[#0f0f0e]">{c.nombre}</option>
                  ))}
                </select>
              </Field>

              <Field label="Precio de venta" required
                hint={margenEstimado ? `Margen est.: $${margenEstimado}` : undefined}>
                <input type="number" min="0" step="0.01" value={form.precio_venta}
                  onChange={e => setForm(p => ({ ...p, precio_venta: e.target.value }))}
                  placeholder="25000" className={inputCls} required />
              </Field>
            </div>

            {/* Columna derecha — insumos */}
            <div className="px-6 py-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium tracking-wider uppercase ${error ? "text-red-400" : "text-white/35"}`}>
                  Insumos requeridos {insumos.filter(i => i.insumo_id).length > 0 &&
                    <span className="text-orange-400 ml-1">({insumos.filter(i => i.insumo_id).length})</span>}
                </p>
                <button type="button" onClick={addInsumo}
                  className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  <FaPlus className="text-[9px]" /> Agregar
                </button>
              </div>

              {error && (
                <div className="px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
                  {error}
                </div>
              )}

              {insumos.length === 0 ? (
                <div className={`flex-1 flex flex-col items-center justify-center text-center py-8 rounded-xl border border-dashed ${error ? "border-red-500/30 bg-red-500/5" : "border-white/[0.06]"}`}>
                  <FaPlus className={`text-xl mb-2 ${error ? "text-red-400/40" : "text-white/10"}`} />
                  <p className={`text-xs ${error ? "text-red-400/60" : "text-white/20"}`}>Sin insumos — agregá al menos uno</p>
                  <button type="button" onClick={addInsumo}
                    className="mt-3 text-xs text-orange-400 hover:text-orange-300 transition-colors">
                    + Agregar insumo
                  </button>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-72 pr-0.5">
                  {insumos.map((ins, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2 space-y-2">
                      {/* Selector ocupa el ancho completo */}
                      <InsumoSelector
                        value={ins.insumo_id}
                        allInsumos={allInsumos || []}
                        onChange={(id) => {
                          const esUnidad = (allInsumos || []).find(i => i.id === id)?.unidad_medida === "unidad";
                          setInsumos(p => p.map((ins2, i2) => i2 === idx
                            ? { ...ins2, insumo_id: id, cantidad_requerida: ins2.insumo_id ? ins2.cantidad_requerida : (esUnidad ? 1 : 0.1) }
                            : ins2
                          ));
                        }}
                      />
                      {/* Cantidad y eliminar en fila separada */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/30 shrink-0">Cantidad:</span>
                        <input
                          type="number"
                          min={isUnidad(ins.insumo_id) ? "1" : "0.01"}
                          step={isUnidad(ins.insumo_id) ? "1" : "0.01"}
                          value={ins.cantidad_requerida}
                          onChange={e => updateInsumo(idx, "cantidad_requerida", Number(e.target.value))}
                          className="w-20 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1.5 text-xs text-[#f5f0eb] outline-none text-center focus:border-orange-500/40" />
                        {ins.insumo_id && (
                          <span className="text-[10px] text-white/30">{getUnidad(ins.insumo_id)}</span>
                        )}
                        <button type="button" onClick={() => removeInsumo(idx)}
                          className="ml-auto text-white/20 hover:text-red-400 transition-colors p-1">
                          <FaTrash className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-50 transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2">
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isLoading ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
};
