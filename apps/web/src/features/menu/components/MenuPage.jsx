import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaUtensils } from "react-icons/fa";
import { useMenuStore } from "../stores/useMenuStore";
import { MenuFilters } from "./MenuFilters";
import { MenuTable } from "./MenuTable";
import { MenuMobileList } from "./MenuMobileList";
import { MenuFormModal } from "./MenuFormModal";

export const MenuPage = () => {
  const { items, isLoading, error, fetchAll, create, update, remove, clearError } = useMenuStore();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = items.filter((i) => {
    const matchSearch = i.nombre?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoria || i.categoria === categoria;
    return matchSearch && matchCat;
  });

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await update(editing.id, data);
      } else {
        await create(data);
      }
      setShowModal(false);
    } catch {}
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este producto del menú?")) {
      remove(id);
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
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body"
          >
            <FaPlus /> Nuevo Plato
          </button>
        </div>

        <MenuFilters search={search} onSearchChange={setSearch} categoria={categoria} onCategoriaChange={setCategoria} />

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
              {search || categoria ? "No se encontraron platos" : "El menú está vacío"}
            </p>
            <p className="text-white/20 text-sm font-body mt-1">Agregá tu primer plato para empezar</p>
          </div>
        ) : (
          <>
            <MenuMobileList items={filtered} onEdit={openEdit} onDelete={handleDelete} />
            <MenuTable items={filtered} onEdit={openEdit} onDelete={handleDelete} />
          </>
        )}
      </div>

      <MenuFormModal
        isOpen={showModal}
        editing={editing}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
