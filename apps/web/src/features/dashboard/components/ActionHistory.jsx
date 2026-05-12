import { Card, Avatar } from '@heroui/react';
import { FiShoppingCart, FiPackage, FiDollarSign, FiUser, FiXCircle, FiEdit3 } from 'react-icons/fi';

const getIconByType = (tipo) => {
  const icons = {
    pedido: { icon: FiShoppingCart, color: 'bg-orange-100 text-orange-600' },
    inventario: { icon: FiPackage, color: 'bg-purple-100 text-purple-600' },
    pago: { icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
    usuario: { icon: FiUser, color: 'bg-blue-100 text-blue-600' },
    producto: { icon: FiEdit3, color: 'bg-yellow-100 text-yellow-600' },
    cancel: { icon: FiXCircle, color: 'bg-red-100 text-red-600' }
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

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="pb-0 p-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FiEdit3 className="text-orange-600" />
          Historial de Acciones
        </h3>
      </div>
      <div className="max-h-80 overflow-y-auto p-4 pt-0">
        <div className="space-y-3">
          {history.map((action) => {
            const { icon: Icon, color } = getIconByType(action.tipo);
            
            return (
              <div key={action.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                  <Icon className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{action.accion}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-orange-600">{action.usuario}</span>
                    <span>•</span>
                    <span>{formatFecha(action.fecha)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ActionHistory;