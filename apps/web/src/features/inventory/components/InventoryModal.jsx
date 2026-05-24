import { useState } from "react";
import { FaFire, FaSpinner } from "react-icons/fa";
import { categorias } from "../utils/inventoryUtils";

const initialCarne  = { corte: "", kg_comprados: "", precio_por_kg: "", proveedor: "" };
const initialInsumo = { nombre: "", categoria: "salsas", unidad_medida: "unid", stock_actual: "", stock_minimo: "" };

const InventoryModal = ({ isOpen, onClose, onAdd, tipo = "carnes" }) => {
  const [carne,  setCarne]  = useState(initialCarne);
  const [insumo, setInsumo] = useState(initialInsumo);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const esCarnes = tipo === "carnes";

  const handleAdd = async () => {
    setError("");

    if (esCarnes) {
      if (!carne.corte || !carne.kg_comprados || !carne.precio_por_kg) {
        setError("Corte, kg comprados y precio son requeridos");
        return;
      }
      setSubmitting(true);
      try {
        await onAdd({
          corte: carne.corte,
          kg_comprados: Number(carne.kg_comprados),
          precio_por_kg: Number(carne.precio_por_kg),
          proveedor: carne.proveedor || null,
          categoria: "carnes",
        });
        setCarne(initialCarne);
        onClose();
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Error al crear la carne");
      }
    } else {
      if (!insumo.nombre || !insumo.unidad_medida) {
        setError("Nombre y unidad de medida son requeridos");
        return;
      }
      setSubmitting(true);
      try {
        await onAdd({
          nombre: insumo.nombre,
          categoria: insumo.categoria,
          unidad_medida: insumo.unidad_medida,
          stock_actual: Number(insumo.stock_actual) || 0,
          stock_minimo: Number(insumo.stock_minimo) || 0,
        });
        setInsumo(initialInsumo);
        onClose();
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Error al crear el insumo");
      }
    }

    setSubmitting(false);
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
            <h2 className="text-lg font-heading font-bold text-[#f5f0eb]">
              {esCarnes ? "Nueva Carne" : "Nuevo Insumo"}
            </h2>
            <p className="text-xs text-white/40 font-body">Agregar al inventario</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body">
            {error}
          </div>
        )}

        {esCarnes ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Corte *</label>
              <input value={carne.corte} onChange={(e) => setCarne({ ...carne, corte: e.target.value })}
                placeholder="Ej: Lomo fino"
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-body outline-none focus:border-orange-500/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 font-body mb-1.5">Kg comprados *</label>
                <input type="number" value={carne.kg_comprados} onChange={(e) => setCarne({ ...carne, kg_comprados: e.target.value })}
                  placeholder="25"
                  className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-number outline-none focus:border-orange-500/30" />
              </div>
              <div>
                <label className="block text-sm text-white/60 font-body mb-1.5">Precio por kg *</label>
                <input type="number" value={carne.precio_por_kg} onChange={(e) => setCarne({ ...carne, precio_por_kg: e.target.value })}
                  placeholder="35000"
                  className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-number outline-none focus:border-orange-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Proveedor</label>
              <input value={carne.proveedor} onChange={(e) => setCarne({ ...carne, proveedor: e.target.value })}
                placeholder="Nombre del proveedor (opcional)"
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-body outline-none focus:border-orange-500/30" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Nombre *</label>
              <input value={insumo.nombre} onChange={(e) => setInsumo({ ...insumo, nombre: e.target.value })}
                placeholder="Ej: Sal gruesa"
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-body outline-none focus:border-orange-500/30" />
            </div>
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Categoría</label>
              <select value={insumo.categoria} onChange={(e) => setInsumo({ ...insumo, categoria: e.target.value })}
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] font-body outline-none appearance-none cursor-pointer">
                {categorias.filter((c) => c.id !== "carnes").map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0c0c0c]">{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 font-body mb-1.5">Stock actual</label>
                <input type="number" value={insumo.stock_actual} onChange={(e) => setInsumo({ ...insumo, stock_actual: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-number outline-none focus:border-orange-500/30" />
              </div>
              <div>
                <label className="block text-sm text-white/60 font-body mb-1.5">Stock mínimo</label>
                <input type="number" value={insumo.stock_minimo} onChange={(e) => setInsumo({ ...insumo, stock_minimo: e.target.value })}
                  placeholder="5"
                  className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-number outline-none focus:border-orange-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 font-body mb-1.5">Unidad de medida *</label>
              <select value={insumo.unidad_medida} onChange={(e) => setInsumo({ ...insumo, unidad_medida: e.target.value })}
                className="w-full px-4 py-2.5 glass rounded-xl text-sm text-[#f5f0eb] font-body outline-none appearance-none cursor-pointer">
                <option value="kg" className="bg-[#0c0c0c]">kg</option>
                <option value="g" className="bg-[#0c0c0c]">g</option>
                <option value="unid" className="bg-[#0c0c0c]">unid</option>
                <option value="lt" className="bg-[#0c0c0c]">lt</option>
                <option value="pacas" className="bg-[#0c0c0c]">pacas</option>
                <option value="bultos" className="bg-[#0c0c0c]">bultos</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={submitting}
            className="flex-1 py-2.5 glass rounded-xl text-sm text-white/60 font-body hover:bg-white/[0.06] transition-all disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={handleAdd} disabled={submitting}
            className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium font-body transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
            {submitting ? <FaSpinner className="animate-spin" /> : null}
            {submitting ? "Creando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
