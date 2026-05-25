import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import api from "../../../services/api";

const CATEGORIAS = [
  { id: "", label: "Sin categoría" },
  { id: "hamburguesas", label: "Hamburguesas" },
  { id: "carnes", label: "Carnes" },
  { id: "bebidas", label: "Bebidas" },
  { id: "entradas", label: "Entradas" },
  { id: "guarniciones", label: "Guarniciones" },
  { id: "postres", label: "Postres" },
];

export const MenuFormModal = ({ isOpen, editing, isLoading, onSubmit, onClose }) => {
  const [form, setForm] = useState({ nombre: "", precio_venta: "", categoria: "" });
  const [insumos, setInsumos] = useState([]);
  const [insumoRows, setInsumoRows] = useState([]);
  const [loadingInsumos, setLoadingInsumos] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingInsumos(true);
    api.get("/inventario/insumos")
      .then(({ data }) => setInsumos(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => setInsumos([]))
      .finally(() => setLoadingInsumos(false));
  }, [isOpen]);

  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre || "",
        precio_venta: editing.precio_venta?.toString() || "",
        categoria: editing.categoria || "",
      });
      setInsumoRows(
        Array.isArray(editing.insumos)
          ? editing.insumos.map((i) => ({ insumo_id: i.insumo_id || i.id, cantidad_requerida: i.cantidad_requerida?.toString() || "" }))
          : []
      );
    } else {
      setForm({ nombre: "", precio_venta: "", categoria: "" });
      setInsumoRows([]);
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const addInsumoRow = () => setInsumoRows((prev) => [...prev, { insumo_id: "", cantidad_requerida: "" }]);

  const removeInsumoRow = (idx) => setInsumoRows((prev) => prev.filter((_, i) => i !== idx));

  const updateInsumoRow = (idx, field, value) =>
    setInsumoRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validInsumos = insumoRows
      .filter((r) => r.insumo_id && r.cantidad_requerida && parseFloat(r.cantidad_requerida) > 0)
      .map((r) => ({ insumo_id: r.insumo_id, cantidad_requerida: parseFloat(r.cantidad_requerida) }));
    onSubmit({
      nombre: form.nombre,
      precio_venta: Number(form.precio_venta),
      categoria: form.categoria || null,
      insumos: validInsumos,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111110] border border-white/[0.06] rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-white/[0.06] sticky top-0 bg-[#111110] z-10">
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

          <div className="border-t border-white/[0.06] pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-white/60 font-body">Insumos requeridos</label>
              <button
                type="button"
                onClick={addInsumoRow}
                disabled={loadingInsumos || insumos.length === 0}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-30"
              >
                <FaPlus /> Agregar
              </button>
            </div>

            {insumoRows.length === 0 ? (
              <p className="text-xs text-white/20 font-body py-2">Sin insumos asignados</p>
            ) : (
              <div className="space-y-2">
                {insumoRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select
                      value={row.insumo_id}
                      onChange={(e) => updateInsumoRow(idx, "insumo_id", e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-[#f5f0eb] focus:outline-none focus:border-orange-500/30 transition-colors font-body"
                    >
                      <option value="" className="bg-[#0c0c0c]">Seleccionar insumo</option>
                      {insumos.map((ins) => (
                        <option key={ins.id} value={ins.id} className="bg-[#0c0c0c]">
                          {ins.nombre} ({ins.unidad_medida})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="Cant."
                      value={row.cantidad_requerida}
                      onChange={(e) => updateInsumoRow(idx, "cantidad_requerida", e.target.value)}
                      className="w-24 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-[#f5f0eb] placeholder:text-white/20 font-number focus:outline-none focus:border-orange-500/30 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeInsumoRow(idx)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <FaTrash className="text-xs" />
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
