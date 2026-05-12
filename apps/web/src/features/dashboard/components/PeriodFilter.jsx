import { FiCalendar, FiGrid, FiClock } from 'react-icons/fi';

const PeriodFilter = ({ periodo, onPeriodoChange }) => {
  const periods = [
    { key: 'dia', label: 'Diario', icon: FiCalendar },
    { key: 'semana', label: 'Semanal', icon: FiGrid },
    { key: 'mes', label: 'Mensual', icon: FiClock }
  ];

  return (
    <div className="flex items-center gap-4 mb-6 animate-fade-in-up stagger-3 opacity-0">
      <span className="text-white/60 font-medium text-sm font-body">Período:</span>
      <div className="flex gap-2">
        {periods.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => onPeriodoChange(p.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 font-body ${
                periodo === p.key
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10'
                  : 'glass text-white/50 hover:text-white/70 hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Icon className="text-sm" />
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PeriodFilter;
