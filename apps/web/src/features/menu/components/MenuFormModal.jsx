import { useState, useEffect } from "react";
import { FaTimes, FaUtensils, FaPlus, FaTrash } from "react-icons/fa";

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
      setError("Debés agregar al menos un insumo antes de guardar el plato.");
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
  const getUnidad    = (id) => (allInsumos || []).find(i => i.id === id)?.unidad_medida || "";

  const margenEstimado = form.precio_venta && editing?.costo_produccion
    ? (Number(form.precio_venta) - editing.costo_produccion).toLocaleString("es-CO")
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl shadow-black/60 animate-fade-in-up max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaUtensils className="text-orange-400 text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
                {editing ? "Editar Plato" : "Nuevo Plato"}
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

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          <Field label="Nombre del plato" required>
            <input type="text" value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Hamburguesa clásica, Bife de chorizo..."
              className={inputCls} required autoFocus />
          </Field>

          <div className="grid grid-cols-2 gap-3">
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

          {/* Insumos */}
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-medium tracking-wider uppercase ${error ? "text-red-400" : "text-white/35"}`}>
                Insumos requeridos{error ? " *" : ""}
              </p>
              <button type="button" onClick={addInsumo}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
                <FaPlus className="text-[9px]" /> Agregar
              </button>
            </div>

            {error && (
              <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            {insumos.length === 0 ? (
              <div className={`text-center py-4 rounded-xl border border-dashed ${error ? "border-red-500/30 bg-red-500/5" : "border-white/[0.06]"}`}>
                <p className={`text-xs ${error ? "text-red-400/60" : "text-white/20"}`}>Sin insumos — agregá al menos uno</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {insumos.map((ins, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-white/[0.02] rounded-xl px-3 py-2">
                    <select value={ins.insumo_id}
                      onChange={e => updateInsumo(idx, "insumo_id", e.target.value)}
                      className="flex-1 bg-transparent text-xs text-[#f5f0eb] outline-none appearance-none cursor-pointer">
                      <option value="" className="bg-[#0f0f0e]">Seleccionar insumo...</option>
                      {(allInsumos || []).map(i => (
                        <option key={i.id} value={i.id} className="bg-[#0f0f0e]">
                          {i.nombre} ({i.unidad_medida})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1 shrink-0">
                      <input type="number" min="0.01" step="0.01" value={ins.cantidad_requerida}
                        onChange={e => updateInsumo(idx, "cantidad_requerida", Number(e.target.value))}
                        className="w-16 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1 text-xs text-[#f5f0eb] outline-none text-center focus:border-orange-500/40" />
                      {ins.insumo_id && (
                        <span className="text-[10px] text-white/25 w-8 shrink-0">{getUnidad(ins.insumo_id)}</span>
                      )}
                    </div>
                    <button type="button" onClick={() => removeInsumo(idx)}
                      className="text-white/20 hover:text-red-400 transition-colors shrink-0">
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            {isLoading ? "Guardando..." : editing ? "Guardar cambios" : "Crear plato"}
          </button>
        </div>
      </div>
    </div>
  );
};
