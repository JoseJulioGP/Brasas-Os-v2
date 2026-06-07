import { FaEdit, FaTimes, FaTrophy, FaCopy } from "react-icons/fa";

export const MenuTable = ({ items, onEdit, onDelete, onDuplicate }) => (
  <div className="hidden md:block animate-fade-in-up opacity-0 stagger-2">
    <div className="glass rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left px-6 py-4 text-xs font-medium text-white/30 font-body uppercase tracking-wider">Producto</th>
            <th className="text-left px-6 py-4 text-xs font-medium text-white/30 font-body uppercase tracking-wider">Categoría</th>
            <th className="text-right px-6 py-4 text-xs font-medium text-white/30 font-body uppercase tracking-wider">Precio Venta</th>
            <th className="text-right px-6 py-4 text-xs font-medium text-white/30 font-body uppercase tracking-wider">Costo Prod.</th>
            <th className="text-right px-6 py-4 text-xs font-medium text-white/30 font-body uppercase tracking-wider">Margen</th>
            <th className="text-right px-6 py-4 text-xs font-medium text-white/30 font-body uppercase tracking-wider">%</th>
            <th className="text-right px-6 py-4 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const margen = item.precio_venta - (item.costo_produccion || 0);
            const porcentaje = item.precio_venta > 0 ? (margen / item.precio_venta) * 100 : 0;
            return (
              <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#f5f0eb] font-body">{item.nombre}</span>
                    {porcentaje > 50 && <FaTrophy className="text-amber-400 text-xs" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.categoria && (
                    <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-1 rounded-full font-body">{item.categoria}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-number text-[#f5f0eb]">${item.precio_venta?.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-number text-white/50">
                    {item.costo_produccion != null ? `$${item.costo_produccion.toLocaleString()}` : "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-number font-medium ${margen > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${margen.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-number ${porcentaje > 30 ? "text-emerald-400" : porcentaje > 10 ? "text-amber-400" : "text-red-400"}`}>
                    {porcentaje.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onDuplicate(item)} title="Duplicar producto"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-orange-400 hover:bg-orange-500/10 transition-all">
                      <FaCopy className="text-xs" />
                    </button>
                    <button onClick={() => onEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                      <FaEdit className="text-xs" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
