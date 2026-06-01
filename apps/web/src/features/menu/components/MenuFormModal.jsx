import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaSearch } from "react-icons/fa";

const CATEGORIAS = [
  { id: "", label: "Sin categoría" },
  { id: "hamburguesas", label: "Hamburguesas" },
  { id: "carnes", label: "Carnes" },
  { id: "bebidas", label: "Bebidas" },
  { id: "entradas", label: "Entradas" },
  { id: "guarniciones", label: "Guarniciones" },
  { id: "postres", label: "Postres" },
];

const initialInsumo = { insumo_id: "", cantidad_requerida: 1, unidad: "" };

export const MenuFormModal = ({ isOpen, editing, isLoading, allInsumos, onSubmit, onClose }) => {
  const [form, setForm] = useState({ nombre: "", precio_venta: "", categoria: "" });
  const [insumos, setInsumos] = useState([]);
  const [insumoSearch, setInsumoSearch] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre || "",
        precio_venta: editing.precio_venta?.toString() || "",
        categoria: editing.categoria || "",
      });
      if (editing.insumos && editing.insumos.length > 0) {
        setInsumos(editing.insumos.map(i => ({
          insumo_id: i.insumo_id,
          cantidad_requerida: i.cantidad_requerida,
          unidad: i.unidad || ""
        })));
      } else {
        setInsumos([]);
      }
    } else {
      setForm({ nombre: "", precio_venta: "", categoria: "" });
      setInsumos([]);
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const insumosValidos = insumos.filter(i => i.insumo_id);
    onSubmit({
      nombre: form.nombre,
      precio_venta: Number(form.precio_venta),
      categoria: form.categoria || null,
      insumos: insumosValidos.length > 0 ? insumosValidos : undefined,
    });
  };

  const addInsumo = () => {
    setInsumos([...insumos, { ...initialInsumo }]);
  };

  const removeInsumo = (index) => {
    setInsumos(insumos.filter((_, i) => i !== index));
  };

  const updateInsumo = (index, field, value) => {
    const updated = [...insumos];
    updated[index] = { ...updated[index], [field]: value };
    setInsumos(updated);
  };

  const filteredInsumos = (allInsumos || []).filter(i =>
    i.nombre?.toLowerCase().includes(insumoSearch.toLowerCase())
  );

  const getInsumoNombre = (id) => {
    const found = (allInsumos || []).find(i => i.id === id);
    return found?.nombre || "Seleccionar...";
  };

  const getInsumoUnidad = (id) => {
    const found = (allInsumos || []).find(i => i.id === id);
    return found?.unidad || found?.unidad_medida || "";
  };

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
            <label className="block text-sm text-white/60 font-body mb-1.5">Nombre del plato</label>
            <input
              type="text"
              placeholder="Ej: Brasa Burger"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 font-body mb-1.5">Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] focus:outline-none focus:border-orange-500/30 transition-colors font-body"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0c0c0c]">{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/60 font-body mb-1.5">Precio de venta ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 15.50"
              value={form.precio_venta}
              onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 font-number focus:outline-none focus:border-orange-500/30 transition-colors"
              required
            />
          </div>

          {/* Insumos requeridos */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-white/60 font-body">Insumos requeridos</label>
              <button
                type="button"
                onClick={addInsumo}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors font-body"
              >
                <FaPlus className="text-[10px]" /> Agregar insumo
              </button>
            </div>

            {insumos.length === 0 ? (
              <p className="text-xs text-white/20 font-body text-center py-3">
                Ningún insumo agregado
              </p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {insumos.map((ins, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 relative">
                      <select
                        value={ins.insumo_id}
                        onChange={(e) => updateInsumo(index, "insumo_id", e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-orange-500/30 transition-colors font-body appearance-none"
                      >
                        <option value="" className="bg-[#0c0c0c]">Seleccionar insumo...</option>
                          {(allInsumos || []).map(i => (
                          <option key={i.id} value={i.id} className="bg-[#0c0c0c]">
                            {i.nombre} {i.unidad || i.unidad_medida ? `(${i.unidad || i.unidad_medida})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24 shrink-0 relative">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder={ins.insumo_id ? `Ej: 0.3` : "Cant."}
                        value={ins.cantidad_requerida}
                        onChange={(e) => updateInsumo(index, "cantidad_requerida", Number(e.target.value))}
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-2 text-xs text-[#f5f0eb] placeholder:text-white/20 font-number focus:outline-none focus:border-orange-500/30 transition-colors text-center pr-7"
                      />
                      {ins.insumo_id && getInsumoUnidad(ins.insumo_id) && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-body pointer-events-none">
                          {getInsumoUnidad(ins.insumo_id)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInsumo(index)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 mt-0.5"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-body"
            >
              {isLoading ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Plato"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/[0.04] text-white/70 rounded-xl font-medium hover:bg-white/[0.08] transition-all font-body"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
