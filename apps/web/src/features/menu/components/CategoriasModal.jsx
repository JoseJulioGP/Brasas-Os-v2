import { useState } from "react";
import { FaTimes, FaPlus, FaTrash, FaTag } from "react-icons/fa";
import { menuService } from "../services/menuService";

export const CategoriasModal = ({ isOpen, onClose, categorias, onCategoriaCreada, onCategoriaEliminada }) => {
  const [nombre, setNombre]       = useState("");
  const [submitting, setSub]      = useState(false);
  const [error, setError]         = useState("");
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setError("");
    setSub(true);
    try {
      const nueva = await menuService.createCategoria(nombre.trim());
      onCategoriaCreada(nueva);
      setNombre("");
    } catch (err) {
      setError(err?.response?.data?.message || "Error al crear la categoría");
    } finally {
      setSub(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await menuService.deleteCategoria(id);
      onCategoriaEliminada(id);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al eliminar la categoría");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60 animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaTag className="text-orange-400 text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
                Categorías
              </h2>
              <p className="text-xs text-white/30">Gestionar categorías del menú</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Crear nueva */}
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-all"
              autoFocus
            />
            <button type="submit" disabled={submitting || !nombre.trim()}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white text-sm font-semibold transition-all flex items-center gap-1.5">
              {submitting
                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <FaPlus className="text-xs" />}
              Crear
            </button>
          </form>

          {error && (
            <p className="text-xs text-red-400 px-1">{error}</p>
          )}

          {/* Lista */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categorias.length === 0 ? (
              <p className="text-xs text-white/25 text-center py-6">No hay categorías creadas</p>
            ) : (
              categorias.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-sm text-[#f5f0eb]">{cat.nombre}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40">
                    {deletingId === cat.id
                      ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      : <FaTrash className="text-[10px]" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
