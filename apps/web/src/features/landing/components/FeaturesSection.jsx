import { FaPercentage, FaCalculator, FaChartLine, FaExclamationTriangle, FaDollarSign } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: FaPercentage,
    title: "Margen por Plato",
    desc: "Calculá automáticamente el margen de cada item del menú vinculando ingredientes, costos de carnes e insumos. Sabé exactamente qué plato te deja más ganancia.",
    accent: "bg-emerald-500/10 border border-emerald-500/20",
  },
  {
    icon: FaCalculator,
    title: "Costeo Automático",
    desc: "Cada plato calcula su costo de producción en base a los ingredientes reales. Sin estimaciones, sin errores.",
    accent: "bg-blue-500/10 border border-blue-500/20",
  },
  {
    icon: FaChartLine,
    title: "Dashboard Financiero",
    desc: "Margen bruto, ingresos vs costos, tendencias semanales y productos estrella. Todo para decisiones de inversión informadas.",
    accent: "bg-orange-500/10 border border-orange-500/20",
  },
  {
    icon: FaExclamationTriangle,
    title: "Alertas de Rentabilidad",
    desc: "Cuando un margen baja de tu umbral, cuando el desperdicio de carne sube. Alertas antes de que sea un problema.",
    accent: "bg-amber-500/10 border border-amber-500/20",
  },
  {
    icon: FaDollarSign,
    title: "ROI por Inversión",
    desc: "¿Qué corte de carne rinde más? ¿Qué insumo genera más ganancia por peso invertido? Datos concretos para comprar mejor.",
    accent: "bg-green-500/10 border border-green-500/20",
  },
  {
    icon: FiTrendingUp,
    title: "Tendencias y Proyecciones",
    desc: "Evolución de márgenes en el tiempo, comparativas mes a mes. Planeá tus compras con inteligencia.",
    accent: "bg-purple-500/10 border border-purple-500/20",
  },
];

export const FeaturesSection = () => (
  <section className="relative border-t border-white/[0.06] py-24">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.06),transparent_70%)] pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full font-body">
          Funcionalidades
        </span>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#f5f0eb] mt-4 mb-4">
          Todo lo que necesitás para ser más rentable
        </h2>
        <p className="text-white/50 font-body text-lg max-w-2xl mx-auto">
          No es un sistema de pedidos. Es una plataforma de inteligencia financiera
          diseñada para restaurantes que quieren dejar de perder plata.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <FeatureCard key={i} {...feat} />
        ))}
      </div>
    </div>
  </section>
);
