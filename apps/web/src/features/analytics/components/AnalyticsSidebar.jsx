import { FaTrophy, FaExclamationTriangle, FaArrowUp, FaArrowDown } from "react-icons/fa";

export const RentablesList = ({ productos }) => {
  const rentables = [...productos].filter((p) => p.margen > 0).slice(0, 5);
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-4">
        <FaTrophy className="text-amber-400 text-sm" />
        Más rentables
      </h3>
      {rentables.length === 0 ? <p className="text-xs text-white/30 font-body">Sin datos</p> : (
        <div className="space-y-3">
          {rentables.map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-number text-white/20 w-4">{i + 1}</span>
                <span className="text-xs text-[#f5f0eb] font-body truncate max-w-[120px]">{p.nombre}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaArrowUp className="text-emerald-400 text-[10px]" />
                <span className="text-xs font-number text-emerald-400">{p.margenPct.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AlertasList = ({ productos }) => {
  const alertas = productos.filter((p) => p.margenPct < 20 && p.margenPct > 0);
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-4">
        <FaExclamationTriangle className="text-amber-400 text-sm" />
        Alertas de margen bajo
      </h3>
      {alertas.length === 0 ? <p className="text-xs text-white/30 font-body">Sin alertas</p> : (
        <div className="space-y-2">
          {alertas.map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-[#f5f0eb] font-body truncate max-w-[140px]">{p.nombre}</span>
              <span className="text-xs font-number text-amber-400">{p.margenPct.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const NoRentablesList = ({ productos }) => {
  const noRentables = [...productos].filter((p) => p.margen <= 0);
  if (noRentables.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-4">
        <FaExclamationTriangle className="text-red-400 text-sm" />
        Productos sin margen
      </h3>
      <div className="space-y-2">
        {noRentables.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs text-[#f5f0eb] font-body truncate max-w-[140px]">{p.nombre}</span>
            <div className="flex items-center gap-1.5">
              <FaArrowDown className="text-red-400 text-[10px]" />
              <span className="text-xs font-number text-red-400">{p.margenPct.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
