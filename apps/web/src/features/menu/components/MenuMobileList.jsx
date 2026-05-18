export const MenuMobileList = ({ items, onEdit, onDelete }) => (
  <div className="md:hidden space-y-3 animate-fade-in-up opacity-0 stagger-2">
    {items.map((item) => {
      const margen = item.precio_venta - (item.costo_produccion || 0);
      return (
        <div key={item.id} className="glass rounded-2xl p-4 glass-hover">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[#f5f0eb] font-medium font-body">{item.nombre}</p>
              {item.categoria && (
                <span className="text-[10px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full font-body">{item.categoria}</span>
              )}
            </div>
            <span className="text-lg font-number font-bold text-[#f5f0eb]">${item.precio_venta?.toLocaleString()}</span>
          </div>
          {item.costo_produccion != null && (
            <div className="flex items-center gap-4 text-xs text-white/40 font-body pt-3 border-t border-white/[0.04]">
              <span>Costo: <span className="font-number text-white/60">${item.costo_produccion.toLocaleString()}</span></span>
              <span>Margen: <span className={`font-number ${margen > 0 ? "text-emerald-400" : "text-red-400"}`}>
                ${margen.toLocaleString()}
              </span></span>
            </div>
          )}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.04]">
            <button onClick={() => onEdit(item)} className="flex-1 py-2 bg-white/[0.04] text-white/50 rounded-xl text-xs hover:bg-white/[0.08] transition-all font-body">
              Editar
            </button>
            <button onClick={() => onDelete(item.id)} className="flex-1 py-2 bg-red-500/5 text-red-400/60 rounded-xl text-xs hover:bg-red-500/10 transition-all font-body">
              Eliminar
            </button>
          </div>
        </div>
      );
    })}
  </div>
);
