import { FiClock, FiDollarSign } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getStockStatus, getStockPercentage, formatFecha, categoriaPorId } from "../utils/inventoryUtils";

const InventoryCard = ({ item, onEdit, onDelete }) => {
  const status     = getStockStatus(item);
  const percentage = getStockPercentage(item);
  const Icon       = status.icon;
  const cat        = categoriaPorId[item.tipo] || categoriaPorId[item.categoria];
  const CatIcon    = cat?.icon;

  const stockActual = parseFloat(item.stock_actual  ?? item.cantidad  ?? 0);
  const stockMinimo = parseFloat(item.stock_minimo  ?? item.stockMinimo ?? 0);
  const costo       = parseFloat(item.costo_unitario_prom ?? item.precio ?? item.precio_por_kg ?? 0);
  const unidad      = item.unidad_medida || item.unidad || "unid";
  const totalValor  = stockActual * costo;
  const fecha       = item.created_at || item.updated_at || item.ultimaActualizacion;

  return (
    <div className="glass rounded-2xl p-5 glass-hover">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.label === "Crítico" ? "bg-red-500/10" : status.label === "Bajo" ? "bg-yellow-500/10" : "bg-green-500/10"}`}>
            {CatIcon
              ? <CatIcon className={`text-xl ${status.label === "Crítico" ? "text-red-400" : status.label === "Bajo" ? "text-yellow-400" : "text-green-400"}`} />
              : <Icon   className={`text-xl ${status.label === "Crítico" ? "text-red-400" : status.label === "Bajo" ? "text-yellow-400" : "text-green-400"}`} />
            }
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-semibold text-[#f5f0eb] font-body truncate">{item.nombre}</h3>
              {cat
                ? <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cat.color}`}>{cat.label}</span>
                : item.tipo && <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium text-white/40 bg-white/[0.04] border-white/[0.08]">{item.tipo}</span>
              }
            </div>
            {costo > 0 && (
              <p className="text-xs text-white/30 font-body flex items-center gap-1">
                <FiDollarSign className="text-[10px]" />
                ${costo.toLocaleString()} / {unidad}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 lg:gap-8 flex-wrap">
          <div className="text-center min-w-[80px]">
            <p className="text-2xl font-bold font-number text-[#f5f0eb]">{stockActual}</p>
            <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">{unidad}</p>
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
              <span>Min: {stockMinimo}</span>
              <span>Actual: {stockActual}</span>
            </div>
          </div>

          {totalValor > 0 && (
            <div className="text-center min-w-[90px]">
              <p className="text-sm font-bold font-number text-[#f5f0eb]">${totalValor.toLocaleString()}</p>
              <p className="text-[10px] text-white/30 font-body uppercase tracking-wider">Valor total</p>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 text-xs text-white/40 font-body min-w-[100px]">
            <FiClock className="shrink-0" />
            <span>{fecha ? formatFecha(fecha) : "—"}</span>
          </div>

          <span className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1.5 font-medium ${status.color}`}>
            <Icon className="text-xs" />
            {status.label}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button onClick={() => onEdit(item)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-orange-400 hover:bg-orange-500/10 transition-all">
                <FaEdit className="text-xs" />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(item.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <FaTrash className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
