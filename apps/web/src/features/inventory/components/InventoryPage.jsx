import { useEffect, useState } from "react";
import { FiPackage } from "react-icons/fi";
import useInventoryStore from "../stores/useInventoryStore";
import InventoryHeader from "./InventoryHeader";
import InventorySearch from "./InventorySearch";
import InventoryCard from "./InventoryCard";
import InventoryModal from "./InventoryModal";

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
      <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="glass rounded-2xl p-12 text-center">
    <FiPackage className="text-4xl text-white/20 mx-auto mb-4" />
    <p className="text-white/50 font-body">No se encontraron insumos</p>
  </div>
);

export const InventoryPage = () => {
  const { items, isLoading, fetchItems, addItem } = useInventoryStore();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = items.filter((i) => {
    const matchSearch = i.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoria || i.categoria === categoria;
    return matchSearch && matchCat;
  });

  const handleAdd = async (newItem) => {
    await addItem(newItem);
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <InventoryHeader onAdd={() => setShowModal(true)} />
        <InventorySearch value={search} onChange={(e) => setSearch(e.target.value)} categoria={categoria} onCategoriaChange={setCategoria} />

        {isLoading && items.length === 0 ? (
          <Spinner />
        ) : (
          <div className="grid gap-4 animate-fade-in-up stagger-3 opacity-0">
            {filtered.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
            {filtered.length === 0 && <EmptyState />}
          </div>
        )}
      </div>

      <InventoryModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />
    </div>
  );
};
