import { Card, Chip } from '@heroui/react';
import { FiShoppingBag, FiDollarSign, FiUsers, FiBox } from 'react-icons/fi';

const StatCard = ({ titulo, valor, icono: Icon, color, subtexto }) => (
  <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
    <div className="flex flex-row items-center gap-4 p-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-2xl text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{titulo}</p>
        <p className="text-2xl font-bold text-gray-800">{valor}</p>
        {subtexto && <p className="text-xs text-gray-400 mt-1">{subtexto}</p>}
      </div>
    </div>
  </Card>
);

const StatsCards = ({ stats }) => {
  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const cards = [
    {
      titulo: 'Pedidos',
      valor: stats?.pedidos || 0,
      icono: FiShoppingBag,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      subtexto: 'Ordenes registradas'
    },
    {
      titulo: 'Ingresos',
      valor: formatCurrency(stats?.ingresos || 0),
      icono: FiDollarSign,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      subtexto: 'Total facturación'
    },
    {
      titulo: 'Clientes Atendidos',
      valor: stats?.clientesAtendidos || 0,
      icono: FiUsers,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      subtexto: 'En el período'
    },
    {
      titulo: 'Stock Total',
      valor: `${stats?.stockTotal || 0} kg`,
      icono: FiBox,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      subtexto: 'En inventario'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;