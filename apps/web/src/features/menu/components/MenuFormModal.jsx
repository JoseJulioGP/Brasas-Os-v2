import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const initialInsumo = { insumo_id: "", cantidad_requerida: 1 };

export const MenuFormModal = ({ isOpen, editing, isLoading, allInsumos, categorias, onSubmit, onClose }) => {
  const [form, setForm]     = useState({ nombre: "", precio_venta: "", categoria_id: "" });
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    if (editing) {
      setForm({
        nombre:       editing.nombre        || "",
        precio_venta: editing.precio_venta?.toString() || "",
        categoria_id: editing.categoria_id  || "",
      });
      setInsumos((editing.insumos || []).map((i) => ({ insumo_id: i.insumo_id, cantidad_requerida: i.cantidad_requerida })));
    } else {
      setForm({ nombre: "", precio_venta: "", categoria_id: "" });
      setInsumos([]);
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const insumosValidos = insumos.filter((i) => i.insumo_id);
    onSubmit({
      nombre:       form.nombre,
      precio_venta: Number(form.precio_venta),
      categoria_id: form.categoria_id || null,
      insumos:      insumosValidos.length > 0 ? insumosValidos : undefined,
    });
  };

  const addInsumo    = () => setInsumos([...insumos, { ...initialInsumo }]);
  const removeInsumo = (idx) => setInsumos(insumos.filter((_, i) => i !== idx));
  const updateInsumo = (idx, field, value) => {
    const updated = [...insumos];
    updated[idx] = { ...updated[idx], [field]: value };
    setInsumos(updated);
  };

  const getInsumoUnidad = (id) => (allInsumos || []).find((i) => i.id === id)?.unidad_medida || "";

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body";
  const labelClass = "block text-sm text-white/60 font-body mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111110] border border-white/[0.06] rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center p-6 border-b border-white/[0.06]">
          <h2 className="text-xl font-heading font-bold text-[#f5f0eb]">
            {editing ? "Editar Plato" : "Nuevo Plato"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Nombre del plato *</label>
            <input type="text" placeholder="Ej: Brasa Burger, Chuleta a la parrilla..."
              value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Categoría</label>
            <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} className={inputClass}>
              <option value="" className="bg-[#0c0c0c]">Sin categoría</option>
              {(categorias || []).map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0c0c0c]">{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Precio de venta ($) *</label>
            <input type="number" min="0" step="0.01" placeholder="Ej: 25000"
              value={form.precio_venta} onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
              className={inputClass} required />
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass + " mb-0"}>Insumos requeridos</label>
              <button type="button" onClick={addInsumo}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors font-body">
                <FaPlus className="text-[10px]" /> Agregar
              </button>
            </div>

            {insumos.length === 0 ? (
              <p className="text-xs text-white/20 font-body text-center py-3">Ningún insumo agregado</p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {insumos.map((ins, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select value={ins.insumo_id} onChange={(e) => updateInsumo(index, "insumo_id", e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-orange-500/30 font-body appearance-none">
                      <option value="" className="bg-[#0c0c0c]">Seleccionar insumo...</option>
                      {(allInsumos || []).map((i) => (
                        <option key={i.id} value={i.id} className="bg-[#0c0c0c]">
                          {i.nombre} {i.unidad_medida ? `(${i.unidad_medida})` : ""}
                        </option>
                      ))}
                    </select>

                    <div className="w-24 shrink-0 relative">
                      <input type="number" min="0.01" step="0.01" placeholder="Cant."
                        value={ins.cantidad_requerida} onChange={(e) => updateInsumo(index, "cantidad_requerida", Number(e.target.value))}
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-2 text-xs text-[#f5f0eb] placeholder:text-white/20 font-number focus:outline-none focus:border-orange-500/30 text-center pr-7" />
                      {ins.insumo_id && getInsumoUnidad(ins.insumo_id) && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30 pointer-events-none">
                          {getInsumoUnidad(ins.insumo_id)}
                        </span>
                      )}
                    </div>

                    <button type="button" onClick={() => removeInsumo(index)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
            <button type="submit" disabled={isLoading}
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 disabled:opacity-50 transition-all font-body">
              {isLoading ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Plato"}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 py-3 bg-white/[0.04] text-white/70 rounded-xl font-medium hover:bg-white/[0.08] transition-all font-body">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
