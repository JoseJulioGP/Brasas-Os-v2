import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaUtensils, FaChartLine } from "react-icons/fa";

const actions = [
  { icon: FaUtensils, title: "Gestionar Menú", desc: "Definí platos, precios y costos de producción", path: "/menu" },
  { icon: FaChartLine, title: "Ver Análisis", desc: "Márgenes por plato, tendencias y rentabilidad", path: "/analisis" },
];

export const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {actions.map((a) => (
        <button key={a.path} onClick={() => navigate(a.path)}
          className="group glass rounded-2xl p-5 text-left glass-hover">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <a.icon className="text-lg text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#f5f0eb] font-body">{a.title}</p>
                <p className="text-xs text-white/40 font-body mt-0.5">{a.desc}</p>
              </div>
            </div>
            <FaArrowRight className="text-white/20 group-hover:text-orange-400 group-hover:translate-x-1 transition-all text-sm mt-2" />
          </div>
        </button>
      ))}
    </div>
  );
};
