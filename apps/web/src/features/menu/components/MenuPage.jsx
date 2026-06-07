import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaUtensils, FaTrash, FaTag } from "react-icons/fa";
import { useMenuStore } from "../stores/useMenuStore";
import { menuService } from "../services/menuService";
import useInventoryStore from "../../inventory/stores/useInventoryStore";
import { MenuFilters } from "./MenuFilters";
import { MenuTable } from "./MenuTable";
import { MenuMobileList } from "./MenuMobileList";
import { MenuFormModal } from "./MenuFormModal";
import { CategoriasModal } from "./CategoriasModal";

export const MenuPage = () => {
  const { items, isLoading, error, fetchAll, create, update, remove, clearError } = useMenuStore();
  const { insumos: allInsumos, fetchInsumos } = useInventoryStore();

  const [search, setSearch]       = useState("");
  const [categoria, setCategoria] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [deleteId, setDeleteId]       = useState(null);
  const [showCategorias, setShowCategorias] = useState(false);

  useEffect(() => {
    clearError();
    fetchAll();
    menuService.getCategorias().then(setCategorias).catch(() => setCategorias([]));
  }, [fetchAll, clearError]);

  useEffect(() => {
    if (showModal && allInsumos.length === 0) fetchInsumos();
  }, [showModal, fetchInsumos, allInsumos.length]);

  const filtered = items.filter((i) => {
    const matchSearch = i.nombre?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !categoria || i.categoria_id === categoria;
    return matchSearch && matchCat;
  });

  const openCreate = () => { setEditing(null); setShowModal(true); };

  const openEdit = async (item) => {
    try { setEditing(await menuService.getById(item.id)); }
    catch { setEditing(item); }
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editing?.id) await update(editing.id, data);
      else await create(data);
      setShowModal(false);
    } catch { /* error queda en store */ }
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = () => { remove(deleteId); setDeleteId(null); };

  const handleDuplicate = async (item) => {
    try {
      const full = await menuService.getById(item.id);
      setEditing({
        ...full,
        id:     null,                          // sin id → se crea nuevo
        nombre: `${full.nombre} (copia)`,      // nombre diferenciado
      });
      setShowModal(true);
    } catch {
      setEditing({ ...item, id: null, nombre: `${item.nombre} (copia)` });
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaUtensils className="text-xl text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">Menú</h1>
              <p className="text-sm text-white/40 font-body">Carta del local con precios y márgenes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCategorias(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] text-white/60 rounded-xl font-medium text-sm hover:bg-white/[0.08] hover:text-white/80 transition-all font-body">
              <FaTag className="text-xs" /> Categorías
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body">
              <FaPlus /> Nuevo Producto
            </button>
          </div>
        </div>

        <MenuFilters search={search} onSearchChange={setSearch} categoria={categoria} onCategoriaChange={setCategoria} categorias={categorias} />

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-4"><FaTimes /></button>
          </div>
        )}

        {isLoading && items.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center animate-fade-in-up opacity-0 stagger-2">
            <FaUtensils className="text-5xl text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-body text-lg">
              {search || categoria ? "No se encontraron productos" : "El menú está vacío"}
            </p>
            <p className="text-white/20 text-sm font-body mt-1">Agregá tu primer producto para empezar</p>
          </div>
        ) : (
          <>
            <MenuMobileList items={filtered} onEdit={openEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
            <MenuTable      items={filtered} onEdit={openEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          </>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60 p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <FaTrash className="text-red-400 text-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>Eliminar producto</h3>
                <p className="text-sm text-white/40 mt-0.5">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
                Cancelar
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-900/30">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <CategoriasModal
        isOpen={showCategorias}
        onClose={() => setShowCategorias(false)}
        categorias={categorias}
        onCategoriaCreada={(nueva) => setCategorias(prev => [...prev, nueva].sort((a,b) => a.nombre.localeCompare(b.nombre)))}
        onCategoriaEliminada={(id) => { setCategorias(prev => prev.filter(c => c.id !== id)); if (categoria === id) setCategoria(""); }}
      />

      <MenuFormModal isOpen={showModal} editing={editing} isLoading={isLoading}
        allInsumos={allInsumos} categorias={categorias} onSubmit={handleSubmit} onClose={() => setShowModal(false)} />
    </div>
  );
};
