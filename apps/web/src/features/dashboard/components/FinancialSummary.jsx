import { FiTrendingUp, FiDollarSign, FiAlertCircle, FiPercent } from 'react-icons/fi';

const FinancialSummary = ({ financial }) => {
  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  if (!financial) return null;

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in-up stagger-5 opacity-0">
      <h3 className="text-lg font-heading font-bold text-[#f5f0eb] flex items-center gap-2 mb-5">
        <FiTrendingUp className="text-orange-400" />
        Resumen Contable
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass rounded-xl p-3 text-center">
          <FiDollarSign className="text-green-400 text-lg mx-auto mb-1.5" />
          <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">Ingresos</p>
          <p className="text-sm font-bold text-green-400 font-number">{formatCurrency(financial.ingresos)}</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <FiAlertCircle className="text-red-400 text-lg mx-auto mb-1.5" />
          <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">Costos</p>
          <p className="text-sm font-bold text-red-400 font-number">{formatCurrency(financial.costos)}</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <FiTrendingUp className="text-blue-400 text-lg mx-auto mb-1.5" />
          <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">Ganancia</p>
          <p className="text-sm font-bold text-blue-400 font-number">{formatCurrency(financial.ganancia)}</p>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm text-white/60 flex items-center gap-1.5 font-body">
            <FiPercent className="text-orange-400" />
            Margen de Ganancia
          </span>
          <span className="text-sm font-bold text-orange-400 font-number">{financial.margen}%</span>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-out"
            style={{ width: `${financial.margen}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-2.5 pt-2.5 border-t border-white/[0.04] font-body">
          <span className="font-number">Relación costos/ingresos: {Math.round((financial.costos / financial.ingresos) * 100)}%</span>
          <span className={financial.margen > 50 ? 'text-green-400/60' : financial.margen > 30 ? 'text-orange-400/60' : 'text-red-400/60'}>
            Rentabilidad: {financial.margen > 50 ? 'Excelente' : financial.margen > 30 ? 'Buena' : 'Regular'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
