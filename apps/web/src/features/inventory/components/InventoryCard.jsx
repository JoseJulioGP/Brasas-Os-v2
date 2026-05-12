import { FiClock } from "react-icons/fi";
import { getStockStatus, getStockPercentage, formatFecha, categoriaPorId } from "../utils/inventoryUtils";

const InventoryCard = ({ item }) => {
  const status = getStockStatus(item);
  const percentage = getStockPercentage(item);
  const Icon = status.icon;
  const cat = categoriaPorId[item.categoria];
  const CatIcon = cat?.icon;

  return (
    <div className="glass rounded-2xl p-5 glass-hover">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.label === "Crítico" ? "bg-red-500/10" : status.label === "Bajo" ? "bg-yellow-500/10" : "bg-green-500/10"}`}>
            {CatIcon && <CatIcon className={`text-xl ${status.label === "Crítico" ? "text-red-400" : status.label === "Bajo" ? "text-yellow-400" : "text-green-400"}`} />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-semibold text-[#f5f0eb] font-body truncate">{item.nombre}</h3>
              {cat && <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cat.color}`}>{cat.label}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 lg:gap-8 flex-wrap">
          <div className="text-center min-w-[80px]">
            <p className="text-2xl font-bold font-number text-[#f5f0eb]">{item.cantidad}</p>
            <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">{item.unidad}</p>
          </div>

          <div className="flex-1 min-w-[120px] lg:w-40">
            <div className="flex justify-between text-xs text-white/40 mb-1.5 font-body">
              <span>Stock</span>
              <span className={status.label === "Crítico" ? "text-red-400" : status.label === "Bajo" ? "text-yellow-400" : "text-green-400"}>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${status.bar}`} style={{ width: `${percentage}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/30 mt-1 font-body">
              <span>Min: {item.stockMinimo}</span>
              <span>Max: {item.stockMinimo * 3}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-white/40 font-body min-w-[100px]">
            <FiClock className="shrink-0" />
            <span>{formatFecha(item.ultimaActualizacion)}</span>
          </div>

          <span className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1.5 font-medium ${status.color}`}>
            <Icon className="text-xs" />
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
