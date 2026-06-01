import { useState } from "react";
import { FaFire, FaSpinner } from "react-icons/fa";

// Valores del enum tipo_insumo_enum en la BD
const TIPOS_INSUMO = [
  { value: "insumo",      label: "Insumo general" },
  { value: "ingrediente", label: "Ingrediente" },
  { value: "carne",       label: "Carne" },
  { value: "bebida",      label: "Bebida" },
  { value: "preparado",   label: "Preparado" },
];

// Valores del enum unidad_medida_enum en la BD
const UNIDADES = ["kg", "g", "litro", "ml", "unidad"];

const initialInsumo = {
  nombre:              "",
  tipo:                "insumo",
  unidad_medida:       "unidad",
  stock_actual:        "",
  stock_minimo:        "",
  costo_unitario_prom: "",
};

const InventoryModal = ({ isOpen, onClose, onAdd }) => {
  const [insumo, setInsumo] = useState(initialInsumo);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAdd = async () => {
    setError("");

    if (!insumo.nombre || !insumo.unidad_medida || !insumo.tipo) {
      setError("Nombre, tipo y unidad de medida son requeridos");
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        nombre:              insumo.nombre,
        tipo:                insumo.tipo,
        unidad_medida:       insumo.unidad_medida,
        stock_actual:        Number(insumo.stock_actual)        || 0,
        stock_minimo:        Number(insumo.stock_minimo)        || 0,
        costo_unitario_prom: Number(insumo.costo_unitario_prom) || 0,
      });
      setInsumo(initialInsumo);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Error al crear el insumo");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass  = "w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#f5f0eb] placeholder-white/20 font-body outline-none focus:border-orange-500/30 transition-colors";
  const selectClass = `${inputClass} cursor-pointer appearance-none`;
  const labelClass  = "block text-sm text-white/60 font-body mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-6 md:p-8 w-full max-w-lg animate-fade-in-up shadow-2xl">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <FaFire className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-[#f5f0eb]">Nuevo Insumo</h2>
            <p className="text-xs text-white/40 font-body">Agregar al inventario</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              value={insumo.nombre}
              onChange={(e) => setInsumo({ ...insumo, nombre: e.target.value })}
              placeholder="Ej: Sal gruesa, Aceite vegetal, Ajo en polvo..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tipo *</label>
            <select
              value={insumo.tipo}
              onChange={(e) => setInsumo({ ...insumo, tipo: e.target.value })}
              className={selectClass}
            >
              {TIPOS_INSUMO.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#0f0f0f]">{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Unidad de medida *</label>
              <select
                value={insumo.unidad_medida}
                onChange={(e) => setInsumo({ ...insumo, unidad_medida: e.target.value })}
                className={selectClass}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u} className="bg-[#0f0f0f]">{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Costo unitario</label>
              <input
                type="number" min="0"
                value={insumo.costo_unitario_prom}
                onChange={(e) => setInsumo({ ...insumo, costo_unitario_prom: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Stock actual</label>
              <input
                type="number" min="0" step="0.01"
                value={insumo.stock_actual}
                onChange={(e) => setInsumo({ ...insumo, stock_actual: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock mínimo</label>
              <input
                type="number" min="0" step="0.01"
                value={insumo.stock_minimo}
                onChange={(e) => setInsumo({ ...insumo, stock_minimo: e.target.value })}
                placeholder="5"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white/60 font-body hover:bg-white/[0.08] transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium font-body transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" />}
            {submitting ? "Creando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
