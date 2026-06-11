import { FiShoppingCart, FiPackage, FiDollarSign, FiUser, FiXCircle, FiEdit3 } from 'react-icons/fi';

const getIconByType = (tipo) => {
  const icons = {
    pedido: { icon: FiShoppingCart, color: 'bg-orange-500/10 text-orange-400' },
    inventario: { icon: FiPackage, color: 'bg-purple-500/10 text-purple-400' },
    pago: { icon: FiDollarSign, color: 'bg-green-500/10 text-green-400' },
    usuario: { icon: FiUser, color: 'bg-blue-500/10 text-blue-400' },
    producto: { icon: FiEdit3, color: 'bg-yellow-500/10 text-yellow-400' },
    cancel: { icon: FiXCircle, color: 'bg-red-500/10 text-red-400' }
  };
  return icons[tipo] || icons.pedido;
};

const ActionHistory = ({ history }) => {
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Hace minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffHours < 48) return 'Ayer';
    return fecha.split(' ')[1];
  };

  if (!history || history.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in-up stagger-7 opacity-0">
      <h3 className="text-lg font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-5">
        <FiEdit3 className="text-orange-400" />
        Historial de Acciones
      </h3>
      <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
        {history.map((action) => {
          const { icon: Icon, color } = getIconByType(action.tipo);

          return (
            <div key={action.id} className="flex items-start gap-3 p-3 rounded-xl glass-hover">
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                  <Icon className="text-sm" />
                </div>
                <div className="w-px flex-1 bg-white/[0.04] mt-1" />
              </div>
              <div className="flex-1 min-w-0 pb-3">
                <p className="text-sm font-medium text-white/90 font-body truncate">{action.accion}</p>
                <div className="flex items-center gap-2 text-xs text-white/40 font-body mt-0.5">
                  <span className="font-medium text-orange-400/80">{action.usuario}</span>
                  <span>•</span>
                  <span>{formatFecha(action.fecha)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionHistory;
