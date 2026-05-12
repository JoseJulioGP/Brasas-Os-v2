import { useEffect } from 'react';
import useDashboardStore from '../stores/useDashboardStore';
import PeriodFilter from './PeriodFilter';
import StatsCards from './StatsCards';
import FinancialSummary from './FinancialSummary';
import InventoryCard from './InventoryCard';
import ActionHistory from './ActionHistory';

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const DashboardPage = () => {
  const {
    periodo,
    stats,
    financial,
    inventory,
    actionHistory,
    isLoading,
    setPeriodo,
    fetchData
  } = useDashboardStore();

  useEffect(() => {
    fetchData();
  }, []);

  const handlePeriodoChange = (newPeriodo) => {
    setPeriodo(newPeriodo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-amber-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70">Resumen de operaciones de Brasas</p>
        </div>

        <PeriodFilter periodo={periodo} onPeriodoChange={handlePeriodoChange} />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialSummary financial={financial} />
              <InventoryCard inventory={inventory} />
            </div>

            <div className="mt-6">
              <ActionHistory history={actionHistory} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;