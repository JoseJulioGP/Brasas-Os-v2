import { FaTrophy } from "react-icons/fa";

export const MargenTable = ({ productos }) => (
  <div className="hidden md:block">
    <table className="w-full">
      <thead>
        <tr className="border-b border-white/[0.04]">
          <th className="text-left px-5 py-3 text-xs font-medium text-white/30 font-body">Producto</th>
          <th className="text-right px-5 py-3 text-xs font-medium text-white/30 font-body">Precio</th>
          <th className="text-right px-5 py-3 text-xs font-medium text-white/30 font-body">Costo</th>
          <th className="text-right px-5 py-3 text-xs font-medium text-white/30 font-body">Margen $</th>
          <th className="text-right px-5 py-3 text-xs font-medium text-white/30 font-body">%</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p, i) => (
          <tr key={p.id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#f5f0eb] font-body">{p.nombre}</span>
                {p.margenPct > 50 && <FaTrophy className="text-amber-400 text-xs" />}
              </div>
              {p.categoria && <span className="text-[10px] text-white/30 font-body">{p.categoria}</span>}
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="text-sm font-number text-[#f5f0eb]">${p.precio_venta?.toLocaleString()}</span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="text-sm font-number text-white/50">
                {p.costo_produccion != null ? `$${p.costo_produccion.toLocaleString()}` : "—"}
              </span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className={`text-sm font-number font-medium ${p.margen > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {p.margen > 0 ? "+" : ""}${Math.round(p.margen).toLocaleString()}
              </span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="w-16 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${p.margenPct > 50 ? "bg-emerald-400" : p.margenPct > 20 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${Math.min(p.margenPct, 100)}%` }} />
                </div>
                <span className={`text-sm font-number w-12 text-right ${p.margenPct > 50 ? "text-emerald-400" : p.margenPct > 20 ? "text-amber-400" : "text-red-400"}`}>
                  {p.margenPct.toFixed(0)}%
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const MargenMobileList = ({ productos }) => (
  <div className="md:hidden space-y-1 p-3">
    {productos.map((p, i) => (
      <div key={p.id || i} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.02]">
        <div>
          <p className="text-sm text-[#f5f0eb] font-body">{p.nombre}</p>
          <p className="text-xs text-white/30 font-body">${p.precio_venta?.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-number font-medium ${p.margen > 0 ? "text-emerald-400" : "text-red-400"}`}>
            {p.margenPct.toFixed(0)}%
          </p>
        </div>
      </div>
    ))}
  </div>
);
