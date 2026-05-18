import { useState } from "react";
import { FaPlus, FaTimes, FaMinus } from "react-icons/fa";
import { ProductSelector } from "./ProductSelector";

const initialItem = { producto_id: "", cantidad: 1 };

export const OrderCreateModal = ({ isOpen, isLoading, onSubmit, onClose }) => {
  const [items, setItems] = useState([{ ...initialItem }]);

  if (!isOpen) return null;

  const addItem = () => setItems([...items, { ...initialItem }]);
  const removeItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = items.filter((i) => i.producto_id);
    if (filtered.length === 0) return;
    onSubmit(filtered);
    setItems([{ ...initialItem }]);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111110] border border-white/[0.06] rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-white/[0.06]">
          <h2 className="text-xl font-heading font-bold text-[#f5f0eb]">Nuevo Pedido</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <ProductSelector value={item.producto_id} onChange={(id) => updateItem(index, "producto_id", id)} />
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  <button type="button" onClick={() => updateItem(index, "cantidad", Math.max(1, (item.cantidad || 1) - 1))}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                    <FaMinus className="text-[10px]" />
                  </button>
                  <span className="w-10 text-center font-number text-sm text-[#f5f0eb]">{item.cantidad}</span>
                  <button type="button" onClick={() => updateItem(index, "cantidad", (item.cantidad || 1) + 1)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                    <FaPlus className="text-[10px]" />
                  </button>
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 mt-1">
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={addItem} className="text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors font-body flex items-center gap-2">
            <FaPlus className="text-[10px]" /> Agregar producto
          </button>

          <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
            <button type="submit" disabled={isLoading}
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-body">
              {isLoading ? "Creando..." : "Crear Pedido"}
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
