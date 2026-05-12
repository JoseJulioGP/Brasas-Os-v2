import { FaFire, FaChartBar, FaUsers, FaBox } from "react-icons/fa";

const defaultFeatures = [
  { icon: FaChartBar, title: "Control total", desc: "Ventas, productos y reportes" },
  { icon: FaUsers, title: "Gestión de personal", desc: "Roles y permisos" },
  { icon: FaBox, title: "Inventario inteligente", desc: "Control de stock y proveedores" },
];

export const AuthBrandSection = ({
  subtitle,
  subtitleClassName,
  features: customFeatures,
  iconSize = "text-5xl",
  logoSize = "w-28 h-28",
  featureSize = "w-11 h-11",
  featureIconSize = "text-lg",
  featuresSpace = "space-y-5",
  animateFloat = true,
  noTopMargin = false,
}) => {
  const featuresList = customFeatures || defaultFeatures;

  return (
    <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center">
      <div className={`relative z-10 flex flex-col items-center text-center ${noTopMargin ? "" : "mt-8"}`}>
        <div
          className={`${logoSize} rounded-full glass flex items-center justify-center mb-6 ${animateFloat ? "animate-float stagger-1" : "stagger-1 animate-fade-in-up opacity-0"}`}
        >
          <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-xl" />
          <FaFire className={`${iconSize} text-orange-500 relative z-10`} />
        </div>

        <h1 className="text-5xl font-heading font-bold text-[#f5f0eb] mb-3 stagger-2 animate-fade-in-up opacity-0">
          Brasas OS
        </h1>

        <p className={`text-base text-white/50 font-body mb-12 max-w-xs stagger-3 animate-fade-in-up opacity-0 ${subtitleClassName || ""}`}>
          {subtitle}
        </p>

        <div className={`${featuresSpace} text-left w-full max-w-xs stagger-4 animate-fade-in-up opacity-0`}>
          {featuresList.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex items-center gap-4 glass rounded-xl p-3 glass-hover group">
                <div className={`${featureSize} rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors duration-300`}>
                  <Icon className={`${featureIconSize} ${feature.color}`} />
                </div>
                <div className="min-w-0">
                  {feature.title ? (
                    <>
                      <h3 className="font-semibold text-sm text-white/90">{feature.title}</h3>
                      <p className="text-xs text-white/50">{feature.desc}</p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-white/90 font-body">{feature.text}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
