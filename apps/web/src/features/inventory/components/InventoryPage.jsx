import { useEffect, useState } from "react";
import { FiPackage, FiRefreshCw } from "react-icons/fi";
import { FaBox, FaSearch, FaPlus, FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import useInventoryStore from "../stores/useInventoryStore";
import InventoryCard from "./InventoryCard";
import InventoryModal from "./InventoryModal";

const TABS = [
  { id: "insumos",     label: "Insumos",    icon: FiPackage },
  { id: "movimientos", label: "Movimientos", icon: FiRefreshCw },
];

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
      <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
    </div>
  </div>
);

const MovimientosTable = ({ movimientos }) => {
  if (movimientos.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <FiRefreshCw className="text-4xl text-white/20 mx-auto mb-4" />
        <p className="text-white/50 font-body">Sin movimientos registrados</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {movimientos.map((mov, i) => (
        <div key={mov.id || i} className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              mov.tipo === "entrada" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              {mov.tipo === "entrada" ? <FaArrowDown /> : <FaArrowUp />}
            </div>
            <div>
              <p className="text-sm font-medium text-[#f5f0eb] font-body">{mov.insumo_nombre || "Insumo"}</p>
              <p className="text-xs text-white/30 font-body">{mov.tipo} · {mov.cantidad} {mov.unidad_medida || ""}</p>
            </div>
          </div>
          <p className="text-xs text-white/40 font-body">
            {mov.created_at ? new Date(mov.created_at).toLocaleDateString("es-CO") : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export const InventoryPage = () => {
  const { insumos, movimientos, isLoading, fetchInsumos, fetchMovimientos, addInsumo, updateInsumo, deleteInsumo } = useInventoryStore();

  const [tab, setTab]             = useState("insumos");
  const [search, setSearch]       = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => { fetchInsumos(); }, [fetchInsumos]);

  useEffect(() => {
    if (tab === "movimientos") fetchMovimientos();
  }, [tab, fetchMovimientos]);

  // Tipos únicos presentes en los insumos cargados
  const tiposDisponibles = [...new Set((insumos || []).map((i) => i.tipo).filter(Boolean))].sort();

  const filteredInsumos = (insumos || []).filter((i) => {
    const matchSearch = i.nombre?.toLowerCase().includes(search.toLowerCase());
    const matchTipo   = !tipoFiltro || i.tipo === tipoFiltro;
    return matchSearch && matchTipo;
  });

  const handleAdd = async (data) => { await addInsumo(data); };

  const handleEdit = async (id, data) => { await updateInsumo(id, data); };

  const openEdit = (item) => { setEditing(item); setShowModal(true); };

  const openCreate = () => { setEditing(null); setShowModal(true); };

  const handleCloseModal = () => { setShowModal(false); setEditing(null); };

  const confirmDelete = async () => {
    setDeleteError("");
    try {
      await deleteInsumo(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "No se pudo eliminar el insumo");
    }
  };

  const closeDeleteModal = () => { setDeleteId(null); setDeleteError(""); };

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in-up opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaBox className="text-xl text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">Inventario</h1>
              <p className="text-sm text-white/40 font-body">Control de insumos y suministros</p>
            </div>
          </div>
          {tab === "insumos" && (
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body">
              <FaPlus /> Agregar Insumo
            </button>
          )}
        </div>

        <div className="flex gap-1 mb-6 p-1 glass rounded-2xl w-fit animate-fade-in-up opacity-0 stagger-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 font-body ${
                  tab === t.id ? "bg-orange-500/15 text-orange-400 shadow-sm" : "text-white/40 hover:text-white/70"
                }`}>
                <Icon className="text-sm" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "insumos" && (
          <div className="mb-6 space-y-3 animate-fade-in-up opacity-0 stagger-2">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
              <input type="text" placeholder="Buscar insumo..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body" />
            </div>

            {tiposDisponibles.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setTipoFiltro("")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all font-body ${
                    tipoFiltro === ""
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                      : "text-white/40 hover:text-white/70 bg-white/[0.04] border border-transparent"
                  }`}>
                  Todos
                </button>
                {tiposDisponibles.map((tipo) => {
                  const count = (insumos || []).filter((i) => i.tipo === tipo).length;
                  return (
                    <button key={tipo} onClick={() => setTipoFiltro(tipo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all font-body flex items-center gap-1.5 ${
                        tipoFiltro === tipo
                          ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                          : "text-white/40 hover:text-white/70 bg-white/[0.04] border border-transparent"
                      }`}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        tipoFiltro === tipo ? "bg-orange-500/20" : "bg-white/[0.06]"
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <Spinner />
        ) : tab === "insumos" ? (
          filteredInsumos.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <FiPackage className="text-4xl text-white/20 mx-auto mb-4" />
              <p className="text-white/50 font-body">
                {search || tipoFiltro ? "No se encontraron insumos con ese filtro" : "No hay insumos registrados"}
              </p>
              {tipoFiltro && (
                <button onClick={() => setTipoFiltro("")} className="mt-2 text-xs text-orange-400 hover:underline font-body">
                  Ver todos
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in-up opacity-0 stagger-3">
              {filteredInsumos.map((item) => (
                <InventoryCard key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteId} />
              ))}
            </div>
          )
        ) : (
          <div className="animate-fade-in-up opacity-0 stagger-3">
            <MovimientosTable movimientos={movimientos || []} />
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeDeleteModal} />
          <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60 p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <FaTrash className="text-red-400 text-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>Eliminar insumo</h3>
                <p className="text-sm text-white/40 mt-0.5">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            {deleteError && (
              <div className="px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
                {deleteError}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={closeDeleteModal}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
                Cancelar
              </button>
              <button onClick={confirmDelete} disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2">
                {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <InventoryModal isOpen={showModal} onClose={handleCloseModal} onAdd={handleAdd} onEdit={handleEdit} editing={editing} />
    </div>
  );
};
