import { FaChartLine } from "react-icons/fa";

export const TopProducts = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 mb-5 animate-fade-in-up opacity-0">
      <h3 className="text-lg font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-4">
        <FaChartLine className="text-orange-400" />
        Productos más rentables
      </h3>
      <div className="space-y-2">
        {products.map((prod, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-number text-white/30 w-5">{i + 1}</span>
              <span className="text-sm text-[#f5f0eb] font-body">{prod.nombre}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40 font-number">${prod.precio_venta?.toLocaleString()}</span>
              <span className="text-xs font-number font-medium text-emerald-400">
                +${(prod.precio_venta - (prod.costo_produccion || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
