import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const problems = [
  "Comprás al ojo, sin saber qué corte es realmente rentable",
  "El costo de tus platos lo estimás 'a ojo' y el margen se reduce",
  "El desperdicio de carne e insumos es un número invisible",
  "No tenés forma de comparar períodos ni medir mejora",
];

const solutions = [
  { label: "Cada plato con su costo real", desc: "Vinculá carnes e insumos a cada item del menú. El sistema calcula el margen automáticamente." },
  { label: "Dashboard de rentabilidad", desc: "Ingresos, costos, margen bruto, productos estrella. Todo actualizado en tiempo real." },
  { label: "Alertas inteligentes", desc: "Cuando un margen baja de tu umbral o el desperdicio sube, te avisamos antes de que afecte tu cierre." },
  { label: "Decisiones con datos", desc: "Comprá basado en rentabilidad real, no en corazonadas. Invertí donde realmente rinde." },
];

export const ProblemSolution = () => (
  <section className="relative border-t border-white/[0.06] py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-medium text-red-400/80 bg-red-500/10 px-3 py-1 rounded-full font-body">
            El problema
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#f5f0eb] mt-4 mb-6">
            El 60% de los restaurantes no sabe cuál es su margen real por plato
          </h2>
          <p className="text-white/50 font-body leading-relaxed mb-6">
            Comprás carne, insumos, pagás personal, y al final del mes no sabés
            exactamente qué rindió y qué no. Sin datos concretos, cada decisión es
            una apuesta.
          </p>
          <div className="space-y-3">
            {problems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-400/60 text-xs mt-1 shrink-0" />
                <span className="text-sm text-white/40 font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="glass rounded-3xl p-8 border border-orange-500/10">
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-body">
              La solución
            </span>
            <h3 className="text-2xl font-heading font-bold text-[#f5f0eb] mt-4 mb-4">
              Brasas OS te da el control financiero total
            </h3>
            <div className="space-y-4">
              {solutions.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-400/80 text-sm mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#f5f0eb] font-body">{item.label}</p>
                    <p className="text-xs text-white/40 font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
