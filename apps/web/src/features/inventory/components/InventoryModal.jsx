import { useState } from "react";
import { FaFire, FaSpinner } from "react-icons/fa";
import { categorias } from "../utils/inventoryUtils";

const InventoryModal = ({ isOpen, onClose, onAdd }) => {
  const [newItem, setNewItem] = useState({ nombre: "", cantidad: "", unidad: "unid", stockMinimo: "", categoria: "carnes" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!newItem.nombre || !newItem.cantidad) return;
    setSubmitting(true);
    setError("");

    try {
      await onAdd({
        nombre: newItem.nombre,
        cantidad: Number(newItem.cantidad),
        unidad: newItem.unidad,
        stockMinimo: Number(newItem.stockMinimo) || 1,
        categoria: newItem.categoria,
      });
      setNewItem({ nombre: "", cantidad: "", unidad: "unid", stockMinimo: "", categoria: "carnes" });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Error al crear el insumo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 md:p-8 w-full max-w-lg animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <FaFire className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-[#f5f0eb]">Nuevo Insumo</h2>
            <p className="text-xs text-white/40 font-body">Agregar producto al inventario</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 font-body mb-1.5">Nombre del insumo</label>
            <input value={newItem.nombre} onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })} placeholder="Ej: Lomo Fino" className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-body outline-none transition-all duration-200 focus:border-orange-500/30" />
          </div>

          <div>
            <label className="block text-sm text-white/60 font-body mb-1.5">Categoría</label>
            <select value={newItem.categoria} onChange={(e) => setNewItem({ ...newItem, categoria: e.target.value })} className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] font-body outline-none transition-all duration-200 focus:border-orange-500/30 appearance-none cursor-pointer">
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0c0c0c]">{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Cantidad</label>
              <input type="number" value={newItem.cantidad} onChange={(e) => setNewItem({ ...newItem, cantidad: e.target.value })} placeholder="25" className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-number outline-none transition-all duration-200 focus:border-orange-500/30" />
            </div>
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Unidad</label>
              <select value={newItem.unidad} onChange={(e) => setNewItem({ ...newItem, unidad: e.target.value })} className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] font-body outline-none transition-all duration-200 focus:border-orange-500/30 appearance-none cursor-pointer">
                <option value="kg" className="bg-[#0c0c0c]">kg</option>
                <option value="g" className="bg-[#0c0c0c]">g</option>
                <option value="unid" className="bg-[#0c0c0c]">unid</option>
                <option value="lt" className="bg-[#0c0c0c]">lt</option>
                <option value="pacas" className="bg-[#0c0c0c]">pacas</option>
                <option value="bultos" className="bg-[#0c0c0c]">bultos</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 font-body mb-1.5">Stock mínimo</label>
            <input type="number" value={newItem.stockMinimo} onChange={(e) => setNewItem({ ...newItem, stockMinimo: e.target.value })} placeholder="10" className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-number outline-none transition-all duration-200 focus:border-orange-500/30" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={submitting} className="flex-1 py-2.5 glass rounded-xl text-sm text-white/60 font-body hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-50">Cancelar</button>
          <button onClick={handleAdd} disabled={submitting} className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium font-body transition-all duration-200 shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
            {submitting ? <FaSpinner className="animate-spin" /> : null}
            {submitting ? "Creando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
