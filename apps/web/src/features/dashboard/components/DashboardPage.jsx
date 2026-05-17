import { useEffect, useState } from 'react';
import useDashboardStore from '../stores/useDashboardStore';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import PeriodFilter from './PeriodFilter';
import StatsCards from './StatsCards';
import FinancialSummary from './FinancialSummary';
import InventoryCard from './InventoryCard';
import ActionHistory from './ActionHistory';

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
      <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const {
    periodo,
    stats,
    financial,
    inventory,
    actionHistory,
    isLoading,
    setPeriodo,
    fetchAll
  } = useDashboardStore();

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchAll().finally(() => setInitialLoad(false));
  }, []);

  const handlePeriodoChange = (newPeriodo) => {
    setPeriodo(newPeriodo);
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 animate-fade-in-up stagger-1 opacity-0">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#f5f0eb] mb-2">Dashboard</h1>
          <p className="text-white/50 font-body">Resumen de operaciones de Brasas</p>
        </div>

        <PeriodFilter periodo={periodo} onPeriodoChange={handlePeriodoChange} />

        {isLoading && initialLoad ? (
          <Spinner />
        ) : (
          <>
            <StatsCards stats={stats} periodo={periodo} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {user?.rol === 'ADMIN' && <FinancialSummary financial={financial} />}
              <InventoryCard inventory={inventory} />
            </div>

            <ActionHistory history={actionHistory} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
