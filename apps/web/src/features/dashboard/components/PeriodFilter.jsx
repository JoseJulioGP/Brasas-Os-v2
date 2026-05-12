import { FiCalendar, FiGrid, FiClock } from 'react-icons/fi';

const PeriodFilter = ({ periodo, onPeriodoChange }) => {
  const periods = [
    { key: 'dia', label: 'Diario', icon: FiCalendar },
    { key: 'semana', label: 'Semanal', icon: FiGrid },
    { key: 'mes', label: 'Mensual', icon: FiClock }
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-white font-medium">Período:</span>
      <div className="flex gap-2">
        {periods.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => onPeriodoChange(p.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                periodo === p.key 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
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