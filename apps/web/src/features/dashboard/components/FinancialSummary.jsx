import { Card } from '@heroui/react';
import { FiTrendingUp, FiDollarSign, FiAlertCircle, FiPercent } from 'react-icons/fi';

const FinancialSummary = ({ financial }) => {
  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  if (!financial) return null;

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="pb-0 p-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FiTrendingUp className="text-orange-600" />
          Resumen Contable
        </h3>
      </div>
      <div className="gap-4 p-4 pt-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <FiDollarSign className="text-green-600 text-xl mx-auto mb-1" />
            <p className="text-xs text-gray-500">Ingresos</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(financial.ingresos)}</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <FiAlertCircle className="text-red-600 text-xl mx-auto mb-1" />
            <p className="text-xs text-gray-500">Costos</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(financial.costos)}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <FiTrendingUp className="text-blue-600 text-xl mx-auto mb-1" />
            <p className="text-xs text-gray-500">Ganancia</p>
            <p className="text-lg font-bold text-blue-700">{formatCurrency(financial.ganancia)}</p>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <FiPercent className="text-sm" />
              Margen de Ganancia
            </span>
            <span className="text-sm font-bold text-orange-600">{financial.margen}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all" 
              style={{ width: `${financial.margen}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2 pt-3 border-t border-gray-100">
          <span>Relación costos/ingresos: {Math.round((financial.costos / financial.ingresos) * 100)}%</span>
          <span>Rentabilidad: {financial.margen > 50 ? 'Excelente' : financial.margen > 30 ? 'Buena' : 'Regular'}</span>
        </div>
      </div>
    </Card>
  );
};

export default FinancialSummary;