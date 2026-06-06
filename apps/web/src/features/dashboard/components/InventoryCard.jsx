import { FiPackage, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const InventoryCard = ({ inventory }) => {
  const getStockStatus = (item) => {
    const actual  = parseFloat(item.stock_actual)  || 0;
    const minimo  = parseFloat(item.stock_minimo)   || 0;
    if (actual <= minimo)       return { color: 'bg-red-500/10 text-red-400 border-red-500/20',    label: 'Crítico', icon: FiAlertTriangle };
    if (actual <= minimo * 1.5) return { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: 'Bajo', icon: FiAlertTriangle };
    return                             { color: 'bg-green-500/10 text-green-400 border-green-500/20',   label: 'OK',      icon: FiCheckCircle };
  };

  const getStockPercentage = (item) => {
    const actual = parseFloat(item.stock_actual) || 0;
    const minimo = parseFloat(item.stock_minimo) || 1;
    return Math.min((actual / (minimo * 3)) * 100, 100);
  };

  const items = Array.isArray(inventory) ? inventory : [];

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in-up stagger-6 opacity-0">
      <h3 className="text-lg font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-5">
        <FiPackage className="text-orange-400" />
        Stock de Insumos
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <FiPackage className="text-4xl text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/30 font-body">Sin insumos registrados</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
          {items.map((item) => {
            const status     = getStockStatus(item);
            const percentage = getStockPercentage(item);
            const Icon       = status.icon;
            const costo      = parseFloat(item.costo_unitario_prom) || 0;

            return (
              <div key={item.id} className="glass rounded-xl p-3.5 glass-hover">
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <p className="font-medium text-white/90 text-sm font-body">{item.nombre}</p>
                    <p className="text-xs text-white/40 font-body">
                      Stock: <span className="font-semibold text-white/60 font-number">
                        {item.stock_actual} {item.unidad_medida}
                      </span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] rounded-full border flex items-center gap-1 font-medium ${status.color}`}>
                    <Icon className="text-[10px]" />
                    {status.label}
                  </span>
                </div>

                <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      status.label === 'Crítico' ? 'bg-red-500' : status.label === 'Bajo' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-white/30 mt-1.5 font-body">
                  <span className="font-number">Mín: {item.stock_minimo} {item.unidad_medida}</span>
                  {costo > 0 && (
                    <span className="font-number">${costo.toLocaleString('es-CO')}/{item.unidad_medida}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryCard;
