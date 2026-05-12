import { useEffect, useState, useRef } from 'react';
import { FiShoppingBag, FiDollarSign, FiUsers, FiBox } from 'react-icons/fi';
import useDashboardStore from '../stores/useDashboardStore';

const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const StatCard = ({ titulo, valor, icono: Icon, color, subtexto }) => (
  <div className="glass rounded-2xl p-5 glass-hover">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
    </div>
    <p className="text-sm text-white/50 font-body mb-1">{titulo}</p>
    <p className="text-2xl font-bold text-[#f5f0eb] font-number animate-value-flicker">{valor}</p>
    {subtexto && <p className="text-xs text-white/30 mt-1.5 font-body">{subtexto}</p>}
  </div>
);

const StatsCards = ({ stats, periodo }) => {
  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const cards = [
    {
      titulo: 'Pedidos',
      valor: stats?.pedidos || 0,
      icono: FiShoppingBag,
      color: 'bg-gradient-to-br from-orange-500/20 to-red-600/20',
      subtexto: 'Ordenes registradas'
    },
    {
      titulo: 'Ingresos',
      valor: formatCurrency(stats?.ingresos || 0),
      icono: FiDollarSign,
      color: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20',
      subtexto: 'Total facturación'
    },
    {
      titulo: 'Clientes Atendidos',
      valor: stats?.clientesAtendidos || 0,
      icono: FiUsers,
      color: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
      subtexto: 'En el período'
    },
    {
      titulo: 'Carnes en Stock',
      valor: stats?.stockTotal ? `${stats.stockTotal} kg` : '0 kg',
      icono: FiBox,
      color: 'bg-gradient-to-br from-purple-500/20 to-pink-600/20',
      subtexto: 'Total de carnes disponibles'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={`${periodo}-${index}`} className="animate-pulse-scale">
          <StatCard {...card} />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
