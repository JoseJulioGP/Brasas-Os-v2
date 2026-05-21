import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

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

  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre || "",
        precio_venta: editing.precio_venta?.toString() || "",
        categoria: editing.categoria || "",
      });
    } else {
      setForm({ nombre: "", precio_venta: "", categoria: "" });
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre: form.nombre,
      precio_venta: Number(form.precio_venta),
      categoria: form.categoria || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111110] border border-white/[0.06] rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
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
