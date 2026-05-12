import { Card } from '@heroui/react';
import { FiPackage, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const InventoryCard = ({ inventory }) => {
  const getStockStatus = (item) => {
    if (item.cantidad <= item.stockMinimo) return { color: 'bg-red-100 text-red-700 border-red-300', label: 'Crítico', icon: FiAlertTriangle };
    if (item.cantidad <= item.stockMinimo * 1.5) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Bajo', icon: FiAlertTriangle };
    return { color: 'bg-green-100 text-green-700 border-green-300', label: 'OK', icon: FiCheckCircle };
  };

  const getStockPercentage = (item) => Math.min((item.cantidad / (item.stockMinimo * 3)) * 100, 100);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="pb-0 p-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FiPackage className="text-orange-600" />
          Stock de Carnes
        </h3>
      </div>
      <div className="max-h-80 overflow-y-auto p-4 pt-0">
        <div className="space-y-3">
          {inventory.map((item) => {
            const status = getStockStatus(item);
            const percentage = getStockPercentage(item);
            const Icon = status.icon;
            
            return (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.nombre}</p>
                    <p className="text-xs text-gray-500">
                      Stock: <span className="font-semibold">{item.cantidad} {item.unidad}</span>
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${status.color}`}>
                    <Icon className="text-xs" />
                    {status.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      status.color.includes('red') ? 'bg-red-500' : status.color.includes('yellow') ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Mín: {item.stockMinimo} {item.unidad}</span>
                  <span>${item.precioKg.toLocaleString('es-CO')}/kg</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InventoryCard;