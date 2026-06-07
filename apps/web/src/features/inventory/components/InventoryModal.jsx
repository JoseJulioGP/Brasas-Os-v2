import { useState, useEffect } from "react";
import { FaTimes, FaBox } from "react-icons/fa";

const TIPOS = [
  { value: "insumo",      label: "Insumo general" },
  { value: "ingrediente", label: "Ingrediente"    },
  { value: "carne",       label: "Carne"          },
  { value: "bebida",      label: "Bebida"         },
  { value: "preparado",   label: "Preparado"      },
];

const UNIDADES = ["kg", "g", "litro", "ml", "unidad"];

const initial = {
  nombre: "", tipo: "insumo", unidad_medida: "unidad",
  stock_actual: "", stock_minimo: "", costo_unitario_prom: "",
};

/* ── Shared styles ── */
const inputCls = "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const Field = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium tracking-wider uppercase text-white/35">
      {label}{required && <span className="text-orange-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const InventoryModal = ({ isOpen, onClose, onAdd, onEdit, editing }) => {
  const [form, setForm]      = useState(initial);
  const [submitting, setSub] = useState(false);
  const [error, setError]    = useState("");

  useEffect(() => {
    if (editing) {
      const limpiar = (v) => {
        const n = parseFloat(v);
        if (isNaN(n) || v === "" || v == null) return "";
        // Elimina ceros decimales innecesarios: 2.0000 → "2", 0.08000 → "0.08"
        return parseFloat(n.toPrecision(10)).toString();
      };
      setForm({
        nombre:              editing.nombre              || "",
        tipo:                editing.tipo                || "insumo",
        unidad_medida:       editing.unidad_medida       || "unidad",
        stock_actual:        limpiar(editing.stock_actual),
        stock_minimo:        limpiar(editing.stock_minimo),
        costo_unitario_prom: limpiar(editing.costo_unitario_prom),
      });
    } else {
      setForm(initial);
    }
    setError("");
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre.trim()) return setError("El nombre es requerido");
    setSub(true);
    try {
      const payload = {
        nombre:              form.nombre.trim(),
        tipo:                form.tipo,
        unidad_medida:       form.unidad_medida,
        stock_actual:        Number(form.stock_actual)        || 0,
        stock_minimo:        Number(form.stock_minimo)        || 0,
        costo_unitario_prom: Number(form.costo_unitario_prom) || 0,
      };
      if (editing) {
        await onEdit(editing.id, payload);
      } else {
        await onAdd(payload);
      }
      setForm(initial);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || `Error al ${editing ? "editar" : "crear"} el insumo`);
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl shadow-black/60 animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FaBox className="text-emerald-400 text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
                {editing ? "Editar Insumo" : "Nuevo Insumo"}
              </h2>
              <p className="text-xs text-white/30">
                {editing ? `Modificando "${editing.nombre}"` : "Agregar al inventario"}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          <Field label="Nombre" required>
            <input value={form.nombre} onChange={e => set("nombre", e.target.value)}
              placeholder="Ej: Carne de res, Sal gruesa..." className={inputCls} autoFocus />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo" required>
              <select value={form.tipo} onChange={e => set("tipo", e.target.value)} className={selectCls}>
                {TIPOS.map(t => (
                  <option key={t.value} value={t.value} className="bg-[#0f0f0e]">{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Unidad" required>
              <select value={form.unidad_medida} onChange={e => set("unidad_medida", e.target.value)} className={selectCls}>
                {UNIDADES.map(u => (
                  <option key={u} value={u} className="bg-[#0f0f0e]">{u}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Stock actual">
              <input type="number" min="0" step="0.01" value={form.stock_actual}
                onChange={e => set("stock_actual", e.target.value)}
                placeholder="0" className={inputCls} />
            </Field>
            <Field label="Stock mínimo">
              <input type="number" min="0" step="0.01" value={form.stock_minimo}
                onChange={e => set("stock_minimo", e.target.value)}
                placeholder="0" className={inputCls} />
            </Field>
            <Field label="Costo unit.">
              <input type="number" min="0" value={form.costo_unitario_prom}
                onChange={e => set("costo_unitario_prom", e.target.value)}
                placeholder="0" className={inputCls} />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-50 transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2">
              {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {submitting ? (editing ? "Guardando..." : "Creando...") : (editing ? "Guardar cambios" : "Crear insumo")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
