import { useEffect } from "react";
import { FaFire } from "react-icons/fa";
import useDashboardStore from "../stores/useDashboardStore";
import { useAuthStore } from "../../auth/stores/useAuthStore";
import PeriodFilter from "./PeriodFilter";
import StatsCards from "./StatsCards";
import FinancialSummary from "./FinancialSummary";
import InventoryCard from "./InventoryCard";
import ActionHistory from "./ActionHistory";
import { FinancialHighlightCards } from "./FinancialHighlightCards";
import { QuickActions } from "./QuickActions";
import { TopProducts } from "./TopProducts";
import { CodigoInvitacion } from "../../users/components/CodigoInvitacion";

/* ── Skeleton genérico ── */
const Skeleton = ({ h = "h-32", rounded = "rounded-2xl" }) => (
  <div className={`${h} ${rounded} bg-white/[0.04] animate-pulse`} />
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const {
    periodo, stats, financial, inventory,
    actionHistory, topProducts, loading,
    setPeriodo, fetchData,
  } = useDashboardStore();

  useEffect(() => { fetchData(); }, []);

  const handlePeriodoChange = (p) => { setPeriodo(p); fetchData(); };

  const isJefeOrAdmin = user?.rol === "JEFE" || user?.rol === "ADMIN";

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in-up opacity-0">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <FaFire className="text-orange-400 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
              Dashboard
            </h1>
            <p className="text-xs text-white/30">
              {user?.nombre ? `Hola, ${user.nombre.split(" ")[0]}` : "Bienvenido"}
            </p>
          </div>
        </div>

        <PeriodFilter periodo={periodo} onPeriodoChange={handlePeriodoChange} />

        {/* Highlight cards — carga inmediata */}
        {loading.financial ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} h="h-24" />)}
          </div>
        ) : (
          <FinancialHighlightCards
            ingresos={financial?.ingresos || stats?.ingresos}
            costos={financial?.costos}
          />
        )}

        {/* Quick actions — no depende de datos */}
        <QuickActions />

        {/* Stats cards */}
        {loading.stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} h="h-28" />)}
          </div>
        ) : (
          <StatsCards stats={stats} periodo={periodo} />
        )}

        {/* Financial + Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {user?.rol === "ADMIN" && (
            loading.financial
              ? <Skeleton h="h-48" />
              : <FinancialSummary financial={financial} />
          )}
          {loading.inventory
            ? <Skeleton h="h-48" />
            : <InventoryCard inventory={inventory} />
          }
        </div>

        {/* Top productos */}
        {loading.products
          ? <Skeleton h="h-40" />
          : <TopProducts products={topProducts} />
        }

        {/* Código invitación */}
        {isJefeOrAdmin && <CodigoInvitacion />}

        {/* Historial */}
        {loading.history
          ? <Skeleton h="h-48" />
          : <ActionHistory history={actionHistory} />
        }
      </div>
    </div>
  );
};

export default DashboardPage;
