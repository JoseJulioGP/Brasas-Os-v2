import { FaUtensils, FaBox, FaShoppingCart, FaChartLine, FaUsers, FaKey } from "react-icons/fa";
import { FiShield } from "react-icons/fi";

const features = [
  {
    icon: FaShoppingCart,
    title: "Pedidos en tiempo real",
    desc: "Empleados crean pedidos desde su panel. JEFE y ADMIN los ven todos al instante con estado actualizado.",
    tag: "Operaciones",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    icon: FaUtensils,
    title: "Menú con costos reales",
    desc: "Cada plato vinculado a sus insumos. El margen se calcula automáticamente en base al costo de producción real.",
    tag: "Rentabilidad",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    iconBg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  },
  {
    icon: FaBox,
    title: "Inventario inteligente",
    desc: "Al completar un pedido, los insumos se descuentan automáticamente. Alertas cuando el stock baja del mínimo.",
    tag: "Inventario",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    icon: FaChartLine,
    title: "Dashboard financiero",
    desc: "Ingresos, costos, margen bruto y top productos rentables. Todo en un solo panel actualizado en tiempo real.",
    tag: "Análisis",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
  {
    icon: FaUsers,
    title: "Gestión de equipo",
    desc: "JEFE genera un código de invitación. Los empleados se registran con ese código y quedan en tu local automáticamente.",
    tag: "Equipo",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
  {
    icon: FiShield,
    title: "Roles y permisos",
    desc: "ADMIN, JEFE y EMPLEADO con accesos diferenciados. Cada usuario ve y hace exactamente lo que le corresponde.",
    tag: "Seguridad",
    tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  },
];

export const FeaturesSection = () => (
  <section className="relative border-t border-white/[0.06] py-24">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.05),transparent_60%)] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
          Funcionalidades
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#f5f0eb] mt-5 mb-4"
          style={{ fontFamily: "Georgia, serif" }}>
          Todo lo que necesita tu restaurante
        </h2>
        <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
          Desde el primer pedido hasta el cierre del día — Brasas OS cubre cada parte de la operación.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i}
              className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-200">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${feat.iconBg}`}>
                  <Icon className="text-base" />
                </div>
                <span className={`text-[10px] font-semibold border px-2.5 py-1 rounded-full tracking-wide ${feat.tagColor}`}>
                  {feat.tag}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#f5f0eb] mb-2"
                style={{ fontFamily: "Georgia, serif" }}>
                {feat.title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
